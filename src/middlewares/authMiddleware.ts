import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorhandler } from '../exceptions/errorhandler';
import ApiError from '../exceptions/apierror';
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes';
import { RoleName } from '../modules/role/entity';

export interface AuthenticatedRequest extends Request {
    user?: any;
}


export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        errorhandler(new ApiError("No Token Provided", StatusCodes.UNAUTHORIZED), res);
    } else {
        try {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET_KEY as string, function (err: any, decoded: any) {
                if (err) {
                    throw err;
                }
                req.user = { id: decoded.id, role: { id: decoded.role?.id, name: decoded.role?.name } };
                console.log(`Authenticated user: ${decoded.id} with role: ${decoded.role}`);
            });
            next();
        } catch {
            errorhandler(new ApiError("Not authorized, token failed", StatusCodes.UNAUTHORIZED), res);
        }
    }
};

export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if ((req as any).user?.role !== RoleName.ADMIN) {
        errorhandler(new ApiError("Access denied: Insufficient permissions", StatusCodes.FORBIDDEN), res);
        return;
    }
    next();
};

export const superAdminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if ((req as any).user?.role !== RoleName.SUPERADMIN) {
        errorhandler(new ApiError("Access denied: Insufficient permissions", StatusCodes.FORBIDDEN), res);
        return;
    }
    next();
};

export const specificRolesOnly = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRoleName = (req as any).user?.role?.name;
        if (!userRoleName || !allowedRoles.includes(userRoleName)) {
            return errorhandler(new ApiError("Access denied: Insufficient permissions", StatusCodes.FORBIDDEN), res);
        }
        next();
    };
};