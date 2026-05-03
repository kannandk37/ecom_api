import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { BinStockManagement } from "../business";

export const binStockRouter = Router();

binStockRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let binStockId = request.params.id as string;
        let binStock = await new BinStockManagement().binStockById(binStockId);
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