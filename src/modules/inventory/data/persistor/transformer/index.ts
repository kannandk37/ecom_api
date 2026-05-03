import { Inventory } from "../../../entity";
import { warehouseRecordToWarehouseEntity } from "../../../../warehouse/data/persistor/transformer";
import { ObjectId } from "mongodb";
import { productRecordToProductEntity } from "../../../../product/data/persistor/transformer";
import { variantRecordToVariantEntity } from "../../../../variant/data/persistor/transformer";

export function inventoryRecordToInventoryEntity(inventoryRecord: any): Inventory {
    let inventory = new Inventory();

    if (inventoryRecord === null || inventoryRecord === undefined) {
        return inventory = null;
    }

    if (inventoryRecord._id) {
        inventory.id = inventoryRecord._id?.toString();
    }

    if (inventoryRecord.product) {
        inventory.product = productRecordToProductEntity(inventoryRecord.product)
    }

    if (inventoryRecord.variant) {
        inventory.variant = variantRecordToVariantEntity(inventoryRecord.variant);
    }

    if (inventoryRecord.warehouse) {
        inventory.warehouse = warehouseRecordToWarehouseEntity(inventoryRecord.warehouse);
    }

    if (inventoryRecord.qtyOnHand !== undefined) {
        inventory.qtyOnHand = inventoryRecord.qtyOnHand;
    }

    if (inventoryRecord.qtyReserved !== undefined) {
        inventory.qtyReserved = inventoryRecord.qtyReserved;
    }

    if (inventoryRecord.qtyCommitted !== undefined) {
        inventory.qtyCommitted = inventoryRecord.qtyCommitted;
    }

    if (inventoryRecord.reorderPoint !== undefined) {
        inventory.reorderPoint = inventoryRecord.reorderPoint;
    }

    if (inventoryRecord.reorderQty !== undefined) {
        inventory.reorderQty = inventoryRecord.reorderQty;
    }

    if (inventoryRecord.reorderOrderedQty !== undefined) {
        inventory.reorderOrderedQty = inventoryRecord.reorderOrderedQty;
    }

    if (inventoryRecord.maxStockLevel !== undefined) {
        inventory.maxStockLevel = inventoryRecord.maxStockLevel;
    }

    if (inventoryRecord.reorderStatus) {
        inventory.reorderStatus = inventoryRecord.reorderStatus;
    }

    if (inventoryRecord.lastMovementAt) {
        inventory.lastMovementAt = inventoryRecord.lastMovementAt;
    }

    if (inventoryRecord.updatedAt) {
        inventory.updatedAt = inventoryRecord.updatedAt;
    }

    return inventory;
}

export function inventoryEntityToInventoryRecord(inventory: Inventory): object {
    let record: any = {};

    if (inventory === null || inventory === undefined) {
        return record = null;
    }

    if (inventory.id) {
        record._id = new ObjectId(inventory.id);
    }

    if (inventory.product?.id) {
        record.product = new ObjectId(inventory.product.id);
    }

    if (inventory.variant?.id) {
        record.variant = new ObjectId(inventory.variant.id);
    }

    if (inventory.warehouse?.id) {
        record.warehouse = new ObjectId(inventory.warehouse.id);
    }

    if (inventory.qtyOnHand !== undefined) {
        record.qtyOnHand = inventory.qtyOnHand;
    }

    if (inventory.qtyReserved !== undefined) {
        record.qtyReserved = inventory.qtyReserved;
    }

    if (inventory.qtyCommitted !== undefined) {
        record.qtyCommitted = inventory.qtyCommitted;
    }

    if (inventory.reorderPoint !== undefined) {
        record.reorderPoint = inventory.reorderPoint;
    }

    if (inventory.reorderQty !== undefined) {
        record.reorderQty = inventory.reorderQty;
    }

    if (inventory.reorderOrderedQty !== undefined) {
        record.reorderOrderedQty = inventory.reorderOrderedQty;
    }

    if (inventory.maxStockLevel !== undefined) {
        record.maxStockLevel = inventory.maxStockLevel;
    }

    if (inventory.reorderStatus) {
        record.reorderStatus = inventory.reorderStatus;
    }

    if (inventory.lastMovementAt) {
        record.lastMovementAt = inventory.lastMovementAt;
    }

    return record;
}

export function inventoriesRecordsToInventoriesEntities(inventoryRecords: any[]): Inventory[] {
    if (!inventoryRecords || inventoryRecords.length === 0) {
        return [];
    }
    return inventoryRecords.map((record) => inventoryRecordToInventoryEntity(record));
}