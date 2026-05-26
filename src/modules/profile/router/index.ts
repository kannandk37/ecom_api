import { Request, Response, Router } from "express";
import ApiError from "../../../exceptions/apierror";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { errorhandler } from "../../../exceptions/errorhandler";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { ProfileManagement } from "../business";
import { RoleName } from "../../role/entity";

export const profileRouter = Router();

profileRouter.get('/staffs',
     verifyToken, specificRolesOnly([RoleName.SUPERADMIN, RoleName.ADMIN]), 
     async (request: Request, response: Response) => {
    try {
        let profileManagement = new ProfileManagement();
        response.status(StatusCodes.OK).send(new SuccessResponse(await profileManagement.profilesByRoles([RoleName.SUPERADMIN, RoleName.ADMIN]), 'Staffs List', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

profileRouter.get('/',
     verifyToken, specificRolesOnly([RoleName.SUPERADMIN, RoleName.ADMIN]), 
     async (request: Request, response: Response) => {
    try {
        let profileManagement = new ProfileManagement();
        response.status(StatusCodes.OK).send(new SuccessResponse(await profileManagement.profilesByRoles([RoleName.SUPERADMIN, RoleName.ADMIN, RoleName.CUSTOMER]), 'Profiles List', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

profileRouter.get('/:id',
     verifyToken, specificRolesOnly([RoleName.SUPERADMIN, RoleName.ADMIN]), 
     async (request: Request, response: Response) => {
    try {
        let id = request.params.id as string;
        let profileManagement = new ProfileManagement();
        response.status(StatusCodes.OK).send(new SuccessResponse(await profileManagement.profileById(id), 'Profiles List', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});