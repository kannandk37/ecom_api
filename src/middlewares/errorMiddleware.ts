import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(`error ${error.message}`)
    next(error)
}

export const invalidPathHandler = (request: Request, response: Response, next: NextFunction) => {
    response.status(404)
    response.send('invalid path')
}