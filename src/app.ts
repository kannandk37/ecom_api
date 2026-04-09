import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// import authRoutes from './routes/authRoutes';
// import productRoutes from './routes/productRoutes';
// import orderRoutes from './routes/orderRoutes';
import { errorHandler, errorLogger, invalidPathHandler, notFound } from './middlewares/errorMiddleware';

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

app.get(
    "/api",
    async (request: Request, response: Response): Promise<Response> => {
        return response.json({ info: "Nature Candy Api running successfully" });
    }
);
// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// Error Handlers
app.use(notFound);
app.use(errorHandler);
app.use(errorLogger);
app.use(invalidPathHandler);

export default app;