import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { brandRawDatumToBrandEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { BrandManagement } from "../business";
import { StatusCodes } from "http-status-codes";


export const brandRouter = Router();

brandRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let brandInfo = brandRawDatumToBrandEntity(request.body.brand);
        let persistedBrand = await new BrandManagement().createBrand(brandInfo);
        response.send(new SuccessResponse(await new BrandManagement().brandById(persistedBrand.id), 'Brand created successfully', StatusCodes.CREATED))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

brandRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let brands = await new BrandManagement().brands();
        response.send(new SuccessResponse(brands, "Brands List", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

brandRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let brandId = request.params.id as string;
        let brand = await new BrandManagement().brandById(brandId);
        response.send(new SuccessResponse(brand, "Brand of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});