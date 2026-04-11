import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { errorHandler, errorLogger, invalidPathHandler, notFound } from './middlewares/errorMiddleware';
import { userAccountRouter } from './modules/user_account/router';
import { PermissionManagement } from './modules/permission/business';
import path from 'path';
import fs from 'fs';
import { permissionsRawDataToPermissionsEntities } from './modules/permission/router/transformer';

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


app.get(
    "/api",
    async (request: Request, response: Response): Promise<Response> => {
        return response.json({ info: "Nature Candy Api running successfully" });
    }
);

seedPermissions().catch((error) => {
    console.error("Error seeding permissions:", error);
});

// Routes
app.use('/api', userAccountRouter);


// Error Handlers
app.use(notFound);
app.use(errorHandler);
app.use(errorLogger);
app.use(invalidPathHandler);

export default app;