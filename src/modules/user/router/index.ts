import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { errorhandler } from "../../../exceptions/errorhandler";
import { UserManagement } from "../business";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { RoleName } from "../../role/entity";

export const userRouter = Router();

userRouter.get('/', verifyToken, specificRolesOnly([RoleName.SUPERADMIN, RoleName.ADMIN]), async (request: Request, response: Response) => {
    try {
        let userManagement = new UserManagement();
        response.send(new SuccessResponse(await userManagement.users(), 'Users List', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
})