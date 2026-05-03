import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { warehouseBinRawDatumToWarehouseBinEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { WarehouseBinManagement } from "../business";
import { StatusCodes } from "http-status-codes";

export const warehouseBinRouter = Router();

warehouseBinRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseBinInfo = warehouseBinRawDatumToWarehouseBinEntity(request.body.warehouseBin);
        let persistedWarehouseBin = await new WarehouseBinManagement().createWarehouseBin(warehouseBinInfo);
        response.status(StatusCodes.CREATED).send(new SuccessResponse(persistedWarehouseBin, 'Warehouse bin created successfully', StatusCodes.CREATED));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseBinRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseBins = await new WarehouseBinManagement().warehouseBins();
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouseBins, 'Warehouse bins list', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseBinRouter.get('/warehouse/:warehouseId', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseId = request.params.warehouseId as string;
        let warehouseBins = await new WarehouseBinManagement().warehouseBinsByWarehouseId(warehouseId);
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouseBins, 'Warehouse bins by warehouse', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseBinRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseBinId = request.params.id as string;
        let warehouseBin = await new WarehouseBinManagement().warehouseBinById(warehouseBinId);
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouseBin, 'Warehouse bin by id', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseBinRouter.put('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseBinId = request.params.id as string;
        let warehouseBinData = warehouseBinRawDatumToWarehouseBinEntity(request.body.warehouseBin);
        let warehouseBin = await new WarehouseBinManagement().updateWarehouseBinById(warehouseBinId, warehouseBinData);
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouseBin, 'Warehouse bin updated successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});