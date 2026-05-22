import { Request, Response, Router } from "express";
import { AuthenticatedRequest, specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { BinStockManagement } from "../business";
import ApiError from "../../../exceptions/apierror";

export const binStockRouter = Router();

binStockRouter.get('/warehousebin/:warehouseBinId/product/:productId', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let warehouseBinId = request.params.warehouseBinId as string;
        let productId = request.params.productId as string;
        let binStocks = await new BinStockManagement().binStocksByWarehouseBinAndProduct(warehouseBinId, productId);
        response.status(StatusCodes.OK).send(new SuccessResponse(binStocks, 'Bin Stock By WarehouseBin And Product', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

binStockRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let binStockId = request.params.id as string;
        let binStock = await new BinStockManagement().binStockById(binStockId);
        if (!binStock) {
           return response.status(StatusCodes.NOT_FOUND).send(new ApiError("Bin stock not found", StatusCodes.NOT_FOUND, true));
        }
        response.status(StatusCodes.OK).send(new SuccessResponse(binStock, 'Bin stock by id', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

binStockRouter.get('/bin/:binId', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let binId = request.params.binId as string;
        let binStocks = await new BinStockManagement().binStocksByBinId(binId);
        response.status(StatusCodes.OK).send(new SuccessResponse(binStocks, 'Bin stocks by bin', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// FEFO sorted — use this in dispatch UI to guide warehouse staff
binStockRouter.get('/inventory/:inventoryId', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let inventoryId = request.params.inventoryId as string;
        let binStocks = await new BinStockManagement().binStocksByInventoryId(inventoryId);
        response.status(StatusCodes.OK).send(new SuccessResponse(binStocks, 'Bin stocks by inventory (FEFO sorted)', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});