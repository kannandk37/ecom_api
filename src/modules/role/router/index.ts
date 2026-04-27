import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { errorhandler } from "../../../exceptions/errorhandler";
import { RoleManagement } from "../../role/business";
import { Role } from "../entity";
import { Permission } from "../../permission/entity";

export const roleRouter = Router();

roleRouter.get('/', async (request: Request, response: Response) => {
    try {
        let roles = await new RoleManagement().getRoles();
        roles.forEach((role: Role) => {
            role.permissions.map((permission: Permission) => permission.id)
        });
        response.status(StatusCodes.OK).send(new SuccessResponse(roles, "Roles List", StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
})