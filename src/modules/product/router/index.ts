import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { productRawDatumToProductEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { ProductManagement } from "../business";
import { StatusCodes } from "http-status-codes";


export const productRouter = Router();

productRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let productInfo = productRawDatumToProductEntity(request.body.product);
        let specsValidationResult = await new ProductManagement().validateSpecs(productInfo?.specs);
        if (specsValidationResult == false) {
            response.status(StatusCodes.BAD_REQUEST).send(new SuccessResponse(productInfo, 'Please Check the Specifications', StatusCodes.BAD_REQUEST))
        } else {
            let persistedProduct = await new ProductManagement().createProduct(productInfo);
            response.status(StatusCodes.CREATED).send(new SuccessResponse(await new ProductManagement().productById(persistedProduct.id), 'Product created successfully', StatusCodes.CREATED))
        }
    } catch (error: any) {
        errorhandler(error, response);
    }
});

productRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let products = await new ProductManagement().products();
        response.status(StatusCodes.OK).send(new SuccessResponse(products, "Products List", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

productRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let productId = request.params.id as string;
        let product = await new ProductManagement().productById(productId);
        response.status(StatusCodes.OK).send(new SuccessResponse(product, "Product of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});