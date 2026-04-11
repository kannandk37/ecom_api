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


app.get(
    "/api",
    async (request: Request, response: Response): Promise<Response> => {
        return response.json({ info: "Nature Candy Api running successfully" });
    }
);

// Seeders
async function seeders() {

    try {
        await seedPermissions();
    } catch (error) {
        console.error("Error seeding permissions:", error);
    }

    try {
        await seedRoles();
    } catch (error) {
        console.error("Error seeding roles", error);
    }

}


seeders();

// Routes
app.use('/api', userAccountRouter);
app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);


// Error Handlers
app.use(notFound);
app.use(errorHandler);
app.use(errorLogger);
app.use(invalidPathHandler);

export default app;