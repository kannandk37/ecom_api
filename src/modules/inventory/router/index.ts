import { Request, Response, Router } from "express";
import { AuthenticatedRequest, specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { InventoryManagement } from "../business";
import { StatusCodes } from "http-status-codes";
import { inventoryRawDatumToInventoryEntity } from "./transformer";
import { binStockRawDatumToBinStockEntity } from "../../bin_stock/router/transformer";
import { stockLedgerRawDatumToStockLedgerEntity } from "../../stock_ledger/router/transformer";
import { DateTime } from "luxon";

export const inventoryRouter = Router();

// Get all inventories
inventoryRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let inventories = await new InventoryManagement().inventories();
        response.status(StatusCodes.OK).send(new SuccessResponse(inventories, 'Inventories list', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Get inventories by warehouse
inventoryRouter.get('/warehouse/:warehouseId', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseId = request.params.warehouseId as string;
        let inventories = await new InventoryManagement().inventoriesByWarehouseId(warehouseId);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventories, 'Inventories by warehouse', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

inventoryRouter.get('/warehouse/:warehouseId/product/:productId', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let warehouseId = request.params.warehouseId as string;
        let productId = request.params.productId as string;
        let inventory = await new InventoryManagement().inventoryByWarehouseIdAndProductId(warehouseId, productId);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Inventory by warehouse And Product', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Get inventory by id
inventoryRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let inventoryId = request.params.id as string;
        let inventory = await new InventoryManagement().inventoryById(inventoryId);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Inventory by id', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

inventoryRouter.post('/addProduct', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let inventoryInfo = request.body.inventory;

        let inventoryData = inventoryRawDatumToInventoryEntity(inventoryInfo);

        let inventory = await new InventoryManagement().addProductToInventoryOfAWarehouse(inventoryData, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Product Add to Inventory successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 2 & 3 — Stock adjustment (initial or normal)
inventoryRouter.post('/adjust', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let inventoryInfo = request.body.inventory;
        let binStockInfo = request.body.binStock;
        let stockLedgerInfo = request.body.stockLedger;

        let inventoryData = inventoryRawDatumToInventoryEntity(inventoryInfo);
        let binStockData = binStockRawDatumToBinStockEntity(binStockInfo);
        let stockLedgerData = stockLedgerRawDatumToStockLedgerEntity(stockLedgerInfo);

        let inventory = await new InventoryManagement().adjustStock(inventoryData, binStockData, stockLedgerData, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Stock adjusted successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 4 — Damage / waste write-off
inventoryRouter.post('/waste', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let inventoryInfo = request.body.inventory;
        let binStockInfo = request.body.binStock;
        let stockLedgerInfo = request.body.stockLedger;

        let inventoryData = inventoryRawDatumToInventoryEntity(inventoryInfo);
        let binStockData = binStockRawDatumToBinStockEntity(binStockInfo);
        let stockLedgerData = stockLedgerRawDatumToStockLedgerEntity(stockLedgerInfo);

        let inventory = await new InventoryManagement().writeOffStock(inventoryData, binStockData, stockLedgerData, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Stock written off successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 5A — Register reorder
inventoryRouter.post('/reorder/register', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let { inventoryId, orderedQty } = request.body;
        let inventory = await new InventoryManagement().registerReorder(inventoryId, orderedQty, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Reorder registered successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 5B — Receive restock
inventoryRouter.post('/reorder/receive', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let { inventoryId, binId, receivedQty, batchNumber, expiryDate, referenceId } = request.body;
        let inventory = await new InventoryManagement().receiveRestock(
            inventoryId, binId, receivedQty, batchNumber,
            expiryDate ? DateTime.fromISO(expiryDate) : null, referenceId, request.user
        );
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Restock received successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 6 — Commit stock on payment (called by order service)
inventoryRouter.post('/commit', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let { productId, variantId, warehouseId, quantity, orderId } = request.body;
        let inventory = await new InventoryManagement().commitStock(productId, variantId, warehouseId, quantity, orderId, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Stock committed successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 7 — Dispatch
inventoryRouter.post('/dispatch', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let { inventoryId, binStockId, quantity, orderId } = request.body;
        let inventory = await new InventoryManagement().dispatchStock(inventoryId, binStockId, quantity, orderId, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Stock dispatched successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 8 — Payment failed
inventoryRouter.post('/release', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let { inventoryId, quantity, orderId } = request.body;
        let inventory = await new InventoryManagement().releaseCommittedStock(inventoryId, quantity, orderId, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Committed stock released successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

// Flow 9 — Return / cancellation
inventoryRouter.post('/return', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let { orderId } = request.body;
        let inventory = await new InventoryManagement().returnStock(orderId, request.user);
        response.status(StatusCodes.OK).send(new SuccessResponse(inventory, 'Stock returned successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});