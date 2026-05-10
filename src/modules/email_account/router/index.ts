import { Router, Response } from "express";
import { AuthenticatedRequest, specificRolesOnly, verifyRefreshToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { EmailAccountManagement } from "../business";

export const emailAccountRouter = Router();

emailAccountRouter.post("/refreshtoken", verifyRefreshToken, specificRolesOnly([RoleName.CUSTOMER, RoleName.ADMIN, RoleName.SUPERADMIN]), async (req: AuthenticatedRequest, res: Response) => {
    try {
        let user = req.user;
        let refreshToken = req.headers.authorization?.split(' ')[1] || '';
        let emailAccountManagement = new EmailAccountManagement();
        let emailAccount = await emailAccountManagement.generateAccessTokenWithRefreshToken(refreshToken, user, user.role);
        res.status(StatusCodes.OK).send(new SuccessResponse(emailAccount, 'Access Token Generated With Refresh Token Successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, res);
    }
});