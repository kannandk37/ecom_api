import { InventoryPersistor } from "../data/persistor";
import { Inventory, ReorderStatus } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { BinStockPersistor } from "../../bin_stock/data/persistor";
import { WarehouseBinPersistor } from "../../warehouse_bin/data/persistor";
import { BinStock } from "../../bin_stock/entity";
import { MovementType, ReferenceType, StockLedger } from "../../stock_ledger/entity";
import { StockLedgerPersistor } from "../../stock_ledger/data/persistor";

export class InventoryManagement {

    async inventories(): Promise<Inventory[]> {
        return new Promise<Inventory[]>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                resolve(await inventoryPersistor.inventories());
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoriesByWarehouseId(warehouseId: string): Promise<Inventory[]> {
        return new Promise<Inventory[]>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                resolve(await inventoryPersistor.inventoriesByWarehouseId(warehouseId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoryById(id: string): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let inventory = await inventoryPersistor.inventoryById(id);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }
                resolve(inventory);
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 2 & 3: STOCK ADJUSTMENT ─────────────────────────────────────────
    // Handles both initial (CREATE) and normal (UPDATE) adjustment in one method.
    // quantityDelta is signed: positive to add, negative to remove.

    async adjustStock(
        productId: string,
        variantId: string,
        warehouseId: string,
        binId: string,
        quantity: number,     // signed
        batchNumber: string,
        expiryDate: Date,
        reorderPoint?: number,
        reorderQty?: number,
        maxStockLevel?: number,
        notes?: string,
        performedBy?: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let binStockPersistor = new BinStockPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();
                let warehouseBinPersistor = new WarehouseBinPersistor();

                // Step 1 — Validate bin capacity for additions
                let bin = await warehouseBinPersistor.warehouseBinById(binId);
                if (!bin) {
                    return reject(new ApiError("Warehouse bin not found", StatusCodes.NOT_FOUND));
                }
                if (!bin.isActive) {
                    return reject(new ApiError("Warehouse bin is inactive", StatusCodes.BAD_REQUEST));
                }
                if (quantity > 0) {
                    let existingBinStocks = await binStockPersistor.binStocksByBinId(binId);
                    let currentBinTotal = existingBinStocks.reduce((sum, bs) => sum + (bs.qtyOnHand ?? 0), 0);
                    if (currentBinTotal + quantity > bin.maxUnits) {
                        return reject(new ApiError(`Bin capacity exceeded. Available space: ${bin.maxUnits - currentBinTotal} units`, StatusCodes.BAD_REQUEST));
                    }
                }

                // Step 2 — Get or create Inventory
                let inventory = await inventoryPersistor.inventoryByProductVariantWarehouse(productId, variantId, warehouseId);
                let qtyBefore = 0;

                if (!inventory) {
                    // Flow 2 — Initial: create inventory
                    if (quantity < 0) {
                        return reject(new ApiError("Cannot reduce stock — no inventory record exists yet", StatusCodes.BAD_REQUEST));
                    }
                    let newInventory = new Inventory();
                    newInventory.product = { id: productId };
                    newInventory.variant = { id: variantId };
                    newInventory.warehouse = { id: warehouseId };
                    newInventory.qtyOnHand = quantity;
                    newInventory.qtyReserved = 0;
                    newInventory.qtyCommitted = 0;
                    newInventory.reorderPoint = reorderPoint;
                    newInventory.reorderQty = reorderQty;
                    newInventory.maxStockLevel = maxStockLevel;
                    newInventory.reorderStatus = ReorderStatus.NONE;
                    newInventory.lastMovementAt = new Date();
                    inventory = await inventoryPersistor.createInventory(newInventory);
                } else {
                    // Flow 3 — Normal: update existing
                    qtyBefore = inventory.qtyOnHand ?? 0;
                    if (quantity < 0 && Math.abs(quantity) > qtyBefore) {
                        return reject(new ApiError("Adjustment would result in negative stock", StatusCodes.BAD_REQUEST));
                    }
                    inventory = await inventoryPersistor.incrementInventoryQty(inventory.id, quantity, 0);
                }

                // Step 3 — Create or update BinStock
                let binStock = await binStockPersistor.binStockByBinAndBatch(binId, inventory.id, batchNumber);
                if (!binStock) {
                    let newBinStock = new BinStock();
                    newBinStock.bin = { id: binId };
                    newBinStock.product = { id: productId };
                    newBinStock.variant = { id: variantId };
                    newBinStock.inventory = { id: inventory.id };
                    newBinStock.qtyOnHand = quantity;
                    newBinStock.batchNumber = batchNumber;
                    newBinStock.expiryDate = expiryDate;
                    newBinStock.lastCountedAt = new Date();
                    binStock = await binStockPersistor.createBinStock(newBinStock);
                } else {
                    binStock = await binStockPersistor.incrementBinStockQty(binStock.id, quantity);
                }

                // Step 4 — Create StockLedger
                let ledger = new StockLedger();
                ledger.inventory = { id: inventory.id };
                ledger.warehouse = { id: warehouseId };
                ledger.bin = { id: binId };
                ledger.binStock = { id: binStock.id };
                ledger.product = { id: productId };
                ledger.variant = { id: variantId };
                ledger.movementType = MovementType.ADJUSTMENT;
                ledger.quantityDelta = quantity;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = inventory.qtyOnHand;
                ledger.referenceType = ReferenceType.MANUAL_ADJUST;
                ledger.referenceId = null;
                ledger.notes = notes ?? 'Stock adjustment';
                ledger.performedBy = performedBy;
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(await inventoryPersistor.inventoryById(inventory.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 4: DAMAGE / WASTE WRITE-OFF ─────────────────────────────────────

    async writeOffStock(
        inventoryId: string,
        binStockId: string,
        quantity: number,   // always positive — method makes it negative
        notes: string,
        performedBy: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let binStockPersistor = new BinStockPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();

                let inventory = await inventoryPersistor.inventoryById(inventoryId);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }
                let binStock = await binStockPersistor.binStockById(binStockId);
                if (!binStock) {
                    return reject(new ApiError("Bin stock not found", StatusCodes.NOT_FOUND));
                }
                if (quantity > binStock.qtyOnHand) {
                    return reject(new ApiError(`Cannot write off ${quantity} units — only ${binStock.qtyOnHand} available in this bin`, StatusCodes.BAD_REQUEST));
                }

                let qtyBefore = inventory.qtyOnHand;

                // Update inventory and binstock
                inventory = await inventoryPersistor.incrementInventoryQty(inventoryId, -quantity, 0);
                await binStockPersistor.incrementBinStockQty(binStockId, -quantity);

                // Create StockLedger
                let ledger = new StockLedger();
                ledger.inventory = { id: inventoryId };
                ledger.warehouse = { id: inventory.warehouse?.id };
                ledger.bin = { id: binStock.bin?.id };
                ledger.binStock = { id: binStockId };
                ledger.product = { id: inventory.product?.id };
                ledger.variant = { id: inventory.variant?.id };
                ledger.movementType = MovementType.DAMAGE_WRITE_OFF;
                ledger.quantityDelta = -quantity;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = inventory.qtyOnHand;
                ledger.referenceType = ReferenceType.MANUAL_ADJUST;
                ledger.referenceId = null;
                ledger.notes = notes;
                ledger.performedBy = performedBy;
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(await inventoryPersistor.inventoryById(inventoryId));
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 5A: REGISTER REORDER ────────────────────────────────────────────

    async registerReorder(inventoryId: string, orderedQty: number, performedBy: string): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let inventory = await inventoryPersistor.inventoryById(inventoryId);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }
                if (inventory.reorderStatus === ReorderStatus.TRIGGERED) {
                    return reject(new ApiError("A reorder is already in progress for this inventory", StatusCodes.CONFLICT));
                }
                let updatePayload = new Inventory();
                updatePayload.reorderStatus = ReorderStatus.TRIGGERED;
                updatePayload.reorderOrderedQty = orderedQty;
                resolve(await inventoryPersistor.updateInventoryById(inventoryId, updatePayload));
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 5B: RECEIVE RESTOCK ─────────────────────────────────────────────

    async receiveRestock(
        inventoryId: string,
        binId: string,
        receivedQty: number,
        batchNumber: string,
        expiryDate: Date,
        referenceId: string,
        performedBy: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let binStockPersistor = new BinStockPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();
                let warehouseBinPersistor = new WarehouseBinPersistor();

                let inventory = await inventoryPersistor.inventoryById(inventoryId);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }

                // Step 1 — Bin capacity check
                let bin = await warehouseBinPersistor.warehouseBinById(binId);
                if (!bin) {
                    return reject(new ApiError("Warehouse bin not found", StatusCodes.NOT_FOUND));
                }
                let existingBinStocks = await binStockPersistor.binStocksByBinId(binId);
                let currentBinTotal = existingBinStocks.reduce((sum, bs) => sum + (bs.qtyOnHand ?? 0), 0);
                if (currentBinTotal + receivedQty > bin.maxUnits) {
                    return reject(new ApiError(`Bin capacity exceeded. Available space: ${bin.maxUnits - currentBinTotal} units`, StatusCodes.BAD_REQUEST));
                }

                let qtyBefore = inventory.qtyOnHand;

                // Step 2 — Update inventory
                inventory = await inventoryPersistor.incrementInventoryQty(inventoryId, receivedQty, 0);
                let updatePayload = new Inventory();
                updatePayload.reorderStatus = ReorderStatus.RECEIVED;
                updatePayload.reorderOrderedQty = null;
                await inventoryPersistor.updateInventoryById(inventoryId, updatePayload);

                // Step 3 — Create or update BinStock (same batch vs new batch)
                let binStock = await binStockPersistor.binStockByBinAndBatch(binId, inventoryId, batchNumber);
                if (!binStock) {
                    // New batch
                    let newBinStock = new BinStock();
                    newBinStock.bin = { id: binId };
                    newBinStock.product = { id: inventory.product?.id };
                    newBinStock.variant = { id: inventory.variant?.id };
                    newBinStock.inventory = { id: inventoryId };
                    newBinStock.qtyOnHand = receivedQty;
                    newBinStock.batchNumber = batchNumber;
                    newBinStock.expiryDate = expiryDate;
                    newBinStock.lastCountedAt = new Date();
                    binStock = await binStockPersistor.createBinStock(newBinStock);
                } else {
                    // Same batch — split shipment
                    binStock = await binStockPersistor.incrementBinStockQty(binStock.id, receivedQty);
                }

                // Step 4 — StockLedger
                let ledger = new StockLedger();
                ledger.inventory = { id: inventoryId };
                ledger.warehouse = { id: inventory.warehouse?.id };
                ledger.bin = { id: binId };
                ledger.binStock = { id: binStock.id };
                ledger.product = { id: inventory.product?.id };
                ledger.variant = { id: inventory.variant?.id };
                ledger.movementType = MovementType.INBOUND_RECEIVE;
                ledger.quantityDelta = receivedQty;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = inventory.qtyOnHand;
                ledger.referenceType = ReferenceType.PURCHASE_ORDER;
                ledger.referenceId = referenceId;
                ledger.notes = `Restock received — batch ${batchNumber}`;
                ledger.performedBy = performedBy;
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(await inventoryPersistor.inventoryById(inventoryId));
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 6: COMMIT STOCK ON PAYMENT ──────────────────────────────────────

    async commitStock(
        productId: string,
        variantId: string,
        warehouseId: string,
        quantity: number,
        orderId: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();

                // Step 1 — Availability check with row-level intent (re-validate inside)
                let inventory = await inventoryPersistor.inventoryByProductVariantWarehouse(productId, variantId, warehouseId);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }
                let qtyAvailable = (inventory.qtyOnHand ?? 0) - (inventory.qtyReserved ?? 0) - (inventory.qtyCommitted ?? 0);
                if (qtyAvailable < quantity) {
                    return reject(new ApiError(`Insufficient stock. Available: ${qtyAvailable}`, StatusCodes.CONFLICT));
                }

                // Step 2 — Commit: increase qtyCommitted, qtyOnHand unchanged
                let qtyBefore = inventory.qtyOnHand;
                inventory = await inventoryPersistor.incrementInventoryQty(inventory.id, 0, quantity);

                // Step 3 — StockLedger (bin is null at this stage)
                let ledger = new StockLedger();
                ledger.inventory = { id: inventory.id };
                ledger.warehouse = { id: warehouseId };
                ledger.bin = null;
                ledger.binStock = null;
                ledger.product = { id: productId };
                ledger.variant = { id: variantId };
                ledger.movementType = MovementType.PICK;
                ledger.quantityDelta = -quantity;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = qtyBefore;  // qtyOnHand did not change here
                ledger.referenceType = ReferenceType.ORDER_ITEM;
                ledger.referenceId = orderId;
                ledger.notes = 'Payment confirmed — stock committed';
                ledger.performedBy = 'system';
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(inventory);
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 7: DISPATCH (PHYSICAL PICK) ─────────────────────────────────────

    async dispatchStock(
        inventoryId: string,
        binStockId: string,
        quantity: number,
        orderId: string,
        performedBy: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let binStockPersistor = new BinStockPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();

                let inventory = await inventoryPersistor.inventoryById(inventoryId);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }
                let binStock = await binStockPersistor.binStockById(binStockId);
                if (!binStock) {
                    return reject(new ApiError("Bin stock not found", StatusCodes.NOT_FOUND));
                }
                if (quantity > binStock.qtyOnHand) {
                    return reject(new ApiError(`Cannot pick ${quantity} units — only ${binStock.qtyOnHand} in this bin`, StatusCodes.BAD_REQUEST));
                }
                if (quantity > inventory.qtyCommitted) {
                    return reject(new ApiError("Dispatch quantity exceeds committed stock", StatusCodes.BAD_REQUEST));
                }

                let qtyBefore = inventory.qtyOnHand;

                // qtyOnHand decreases, qtyCommitted decreases
                inventory = await inventoryPersistor.incrementInventoryQty(inventoryId, -quantity, -quantity);
                await binStockPersistor.incrementBinStockQty(binStockId, -quantity);

                let ledger = new StockLedger();
                ledger.inventory = { id: inventoryId };
                ledger.warehouse = { id: inventory.warehouse?.id };
                ledger.bin = { id: binStock.bin?.id };
                ledger.binStock = { id: binStockId };
                ledger.product = { id: inventory.product?.id };
                ledger.variant = { id: inventory.variant?.id };
                ledger.movementType = MovementType.PICK;
                ledger.quantityDelta = -quantity;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = inventory.qtyOnHand;
                ledger.referenceType = ReferenceType.ORDER_ITEM;
                ledger.referenceId = orderId;
                ledger.notes = 'Dispatched to delivery partner';
                ledger.performedBy = performedBy;
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(await inventoryPersistor.inventoryById(inventoryId));
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 8: PAYMENT FAILED — RELEASE COMMITTED ───────────────────────────

    async releaseCommittedStock(
        inventoryId: string,
        quantity: number,
        orderId: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();

                let inventory = await inventoryPersistor.inventoryById(inventoryId);
                if (!inventory) {
                    return reject(new ApiError("Inventory not found", StatusCodes.NOT_FOUND));
                }

                let qtyBefore = inventory.qtyOnHand;

                // Release committed — qtyOnHand unchanged, qtyCommitted decreases
                inventory = await inventoryPersistor.incrementInventoryQty(inventoryId, 0, -quantity);

                let ledger = new StockLedger();
                ledger.inventory = { id: inventoryId };
                ledger.warehouse = { id: inventory.warehouse?.id };
                ledger.bin = null;
                ledger.binStock = null;
                ledger.product = { id: inventory.product?.id };
                ledger.variant = { id: inventory.variant?.id };
                ledger.movementType = MovementType.ADJUSTMENT;
                ledger.quantityDelta = quantity;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = qtyBefore;  // qtyOnHand unchanged
                ledger.referenceType = ReferenceType.ORDER_ITEM;
                ledger.referenceId = orderId;
                ledger.notes = 'Payment failed — committed stock released';
                ledger.performedBy = 'system';
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(inventory);
            } catch (error) {
                reject(error);
            }
        });
    }

    // ─── FLOW 9: RETURN / CANCELLATION ────────────────────────────────────────

    async returnStock(
        orderId: string,
        performedBy: string
    ): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryPersistor = new InventoryPersistor();
                let binStockPersistor = new BinStockPersistor();
                let stockLedgerPersistor = new StockLedgerPersistor();

                // Step 1 — Find the dispatch ledger entry (PICK with bin assigned) for this order
                let dispatchLedger = await stockLedgerPersistor.dispatchLedgerByOrderId(orderId);
                if (!dispatchLedger) {
                    return reject(new ApiError("No dispatch record found for this order", StatusCodes.NOT_FOUND));
                }

                let inventoryId = dispatchLedger.inventory?.id;
                let binStockId = dispatchLedger.binStock?.id;
                let quantity = Math.abs(dispatchLedger.quantityDelta);

                let inventory = await inventoryPersistor.inventoryById(inventoryId);
                let binStock = await binStockPersistor.binStockById(binStockId);

                if (!inventory || !binStock) {
                    return reject(new ApiError("Inventory or bin stock not found for return", StatusCodes.NOT_FOUND));
                }

                let qtyBefore = inventory.qtyOnHand;

                // Step 2 & 3 — Restore qtyOnHand and BinStock
                inventory = await inventoryPersistor.incrementInventoryQty(inventoryId, quantity, 0);
                await binStockPersistor.incrementBinStockQty(binStockId, quantity);

                // Step 4 — StockLedger
                let ledger = new StockLedger();
                ledger.inventory = { id: inventoryId };
                ledger.warehouse = { id: inventory.warehouse?.id };
                ledger.bin = { id: binStock.bin?.id };
                ledger.binStock = { id: binStockId };
                ledger.product = { id: inventory.product?.id };
                ledger.variant = { id: inventory.variant?.id };
                ledger.movementType = MovementType.RETURN_RECEIVE;
                ledger.quantityDelta = quantity;
                ledger.qtyBefore = qtyBefore;
                ledger.qtyAfter = inventory.qtyOnHand;
                ledger.referenceType = ReferenceType.RETURN;
                ledger.referenceId = orderId;
                ledger.notes = 'Returned — undelivered or cancelled';
                ledger.performedBy = performedBy;
                await stockLedgerPersistor.createStockLedger(ledger);

                resolve(await inventoryPersistor.inventoryById(inventoryId));
            } catch (error) {
                reject(error);
            }
        });
    }
}