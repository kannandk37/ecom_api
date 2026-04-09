import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorhandler } from '../exceptions/errorhandler';
import ApiError from '../exceptions/apierror';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';

export interface AuthenticatedRequest extends Request {
    user?: any;
}


export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        errorhandler(new ApiError("No Token Provided", StatusCodes.UNAUTHORIZED), res);
    } else {
        try {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET as string, function (err: any, decoded: any) {
                if (err) {
                    throw err;
                }
                req.user = { id: decoded.id };
                console.log(`Authenticated user: ${decoded.id} with role: ${decoded.role}`);
            });
            next();
        } catch {
            errorhandler(new ApiError("Not authorized, token failed", StatusCodes.UNAUTHORIZED), res);
        }
    }
};

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if ((req as any).user?.role !== 'admin') {
        errorhandler(new ApiError("Admin access only", StatusCodes.FORBIDDEN), res);
        return;
    } else {
        next();
    }
};