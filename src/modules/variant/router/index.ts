import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { variantRawDatumToVariantEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { VariantManagement } from "../business";
import { StatusCodes } from "http-status-codes";


export const variantRouter = Router();

variantRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let variantInfo = variantRawDatumToVariantEntity(request.body.variant);
        let persistedVariant = await new VariantManagement().createVariant(variantInfo);
        response.send(new SuccessResponse(await new VariantManagement().variantById(persistedVariant.id), 'Variant created successfully', StatusCodes.CREATED))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

variantRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let variants = await new VariantManagement().variants();
        response.send(new SuccessResponse(variants, "Variants List", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

variantRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let variantId = request.params.id as string;
        let variant = await new VariantManagement().variantById(variantId);
        response.send(new SuccessResponse(variant, "Variant of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});