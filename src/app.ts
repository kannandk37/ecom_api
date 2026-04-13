import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { errorHandler, errorLogger, invalidPathHandler, notFound } from './middlewares/errorMiddleware';
import { userAccountRouter } from './modules/user_account/router';
import { PermissionManagement } from './modules/permission/business';
import { permissionsRawDataToPermissionsEntities } from './modules/permission/router/transformer';
import { userRouter } from './modules/user/router';
import { rolesRawDataToRolesEntities } from './modules/role/router/transformer';
import { RoleManagement } from './modules/role/business';
import { roleRouter } from './modules/role/router';
import { RoleName } from './modules/role/entity';
import { Profile } from './modules/profile/entity';
import { AccountStatus, UserAccount } from './modules/user_account/entity';
import { UserAccountManagement } from './modules/user_account/business';
import mongoose from 'mongoose';
import { UserManagement } from './modules/user/business';
import { User } from './modules/user/entity';
import { ProfileManagement } from './modules/profile/business';
import { categoryRouter } from './modules/category/router';
import { brandRouter } from './modules/brand/router';
import { productRouter } from './modules/product/router';
import { variantRouter } from './modules/variant/router';
import { addressRouter } from './modules/address/router';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const requestLogger = (
    request: Request,
    response: Response,
    next: NextFunction) => {

    console.log(`${request.method} url:: ${request.baseUrl}${request.url}`);
    next()
};

app.use(requestLogger);

//seed Permissions
async function seedPermissions(): Promise<void> {

    const filePath = path.join(__dirname, './data/permissions.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const rawList: any[] = JSON.parse(raw);
    const entities = permissionsRawDataToPermissionsEntities(rawList);

    let created = 0;
    let skipped = 0;

    for (const record of entities) {
        const exists = await new PermissionManagement().getPermissionByKey(record.key);

        if (exists) {
            skipped++;
            continue;
        }

        await new PermissionManagement().createPermission(record);
        created++;
    }

    console.log(`✔ Permissions seeded — created: ${created}, skipped (already exist): ${skipped}`);
}

async function seedRoles(): Promise<void> {

    const filePath = path.join(__dirname, './data/roles.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const rawList: any[] = JSON.parse(raw);
    const entities = rolesRawDataToRolesEntities(rawList);

    for (const record of entities) {
        const permissions = await new PermissionManagement().getPermissionsByKeys(record.permissions.map(item => item.key));
        record.permissions = permissions;
        await new RoleManagement().createOrUpdateRole(record);
    }

    console.log(`✔ Role seeded`);
}

async function OnBoardSuperAdmin(): Promise<void> {
    try {

        let superAminData: any = {};

        let userAccount = new UserAccount();
        userAccount.email = process.env.ADMIN_EMAIL;
        userAccount.status = AccountStatus.ACTIVE;
        userAccount.password = process.env.ADMIN_PASSWORD;
        userAccount.passwordResetedOn = new Date();

        superAminData.userAccount = userAccount;

        let existingSuperAdminAccount = await new UserAccountManagement().userAccountByEmail(superAminData.userAccount);
        if (!existingSuperAdminAccount) {

            let role = await new RoleManagement().getRoleByName(RoleName.SUPERADMIN);

            let profile = new Profile();
            profile.role = role;
            profile.name = process.env.ADMIN_NAME;
            profile.email = process.env.ADMIN_EMAIL;
            profile.mobile = process.env.ADMIN_MOBILE;
            profile.isEmailVerified = true;

            superAminData.profile = profile;

            let user = new User();
            user.roles = [role];
            superAminData.user = user;

            const session = await mongoose.startSession();

            try {
                await session.withTransaction(async () => {
                    const newUser = await new UserManagement().createUser(superAminData.user, session);
                    profile.user = newUser;
                    superAminData.profile = profile;
                    await new ProfileManagement().createProfile(superAminData.profile, session);
                    userAccount.user = newUser;
                    superAminData.userAccount = userAccount;
                    await new UserAccountManagement().addEmailAccount(superAminData.userAccount, session);
                    superAminData.user = newUser;
                });

                console.log("Transaction committed successfully.");
                console.log("super admin created:", JSON.stringify(superAminData, null, 2));
            } catch (error) {
                console.error("Transaction aborted due to error:", error);
            } finally {
                await session.endSession();
            }
        }
    } catch (error) {
        console.log(error);
    }
}

app.get(
    "/api",
    async (request: Request, response: Response): Promise<Response> => {
        return response.json({ info: "Nature Candy Api running successfully" });
    }
);

// Seeders
async function seeders() {
    // seed permissions
    await seedPermissions();

    // seed roles
    await seedRoles();

    // onboard super admin user
    await OnBoardSuperAdmin();
}


seeders();

// Routes
app.use('/api', userAccountRouter);
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/brands', brandRouter);
app.use('/api/products', productRouter);
app.use('/api/variants', variantRouter);
app.use('/api/addresses', addressRouter);


// Error Handlers
app.use(notFound);
app.use(errorHandler);
app.use(errorLogger);
app.use(invalidPathHandler);

export default app;