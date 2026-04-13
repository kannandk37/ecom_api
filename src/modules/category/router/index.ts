import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { categoryRawDatumToCategoryEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { CategoryManagement } from "../business";
import { StatusCodes } from "http-status-codes";


export const categoryRouter = Router();

categoryRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let categoryInfo = categoryRawDatumToCategoryEntity(request.body);
        let persistedCategory = await new CategoryManagement().createCategory(categoryInfo);
        response.send(new SuccessResponse(await new CategoryManagement().categoryById(persistedCategory.id), 'Category created successfully', StatusCodes.CREATED))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

categoryRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let categories = await new CategoryManagement().categories();
        response.send(new SuccessResponse(categories, "Categories List", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

categoryRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let categoryId = request.params.id as string;
        let category = await new CategoryManagement().categoryById(categoryId);
        response.send(new SuccessResponse(category, "Category of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});