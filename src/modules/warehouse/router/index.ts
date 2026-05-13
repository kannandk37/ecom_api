import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { warehouseRawDatumToWarehouseEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { WarehouseManagement } from "../business";
import { StatusCodes } from "http-status-codes";
import { warehouseBinsRawDataToWarehouseBinsEntities } from "../../warehouse_bin/router/transformer";

export const warehouseRouter = Router();

warehouseRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseInfo = warehouseRawDatumToWarehouseEntity(request.body.warehouse);
        let warehouseBinInfos = warehouseBinsRawDataToWarehouseBinsEntities(request.body.warehouseBins);
        let persistedWarehouse = await new WarehouseManagement().createWarehouseAndEssentials(warehouseInfo, warehouseBinInfos);
        response.status(StatusCodes.CREATED).send(new SuccessResponse(persistedWarehouse, 'Warehouse created successfully', StatusCodes.CREATED));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouses = await new WarehouseManagement().warehouses();
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouses, 'Warehouses list', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseId = request.params.id as string;
        let warehouse = await new WarehouseManagement().warehouseById(warehouseId);
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouse, 'Warehouse by id', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

warehouseRouter.put('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseId = request.params.id as string;
        let warehouseData = warehouseRawDatumToWarehouseEntity(request.body.warehouse);
        let warehouseBinInfos = warehouseBinsRawDataToWarehouseBinsEntities(request.body.warehouseBins);
        let warehouse = await new WarehouseManagement().updateWarehouseAndEssentialsByWarehouseId(warehouseId, warehouseData, warehouseBinInfos);
        response.status(StatusCodes.OK).send(new SuccessResponse(warehouse, 'Warehouse updated successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});