import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { warehouseRawDatumToWarehouseEntity } from "../../../warehouse/router/transformer";
import { warehouseBinsRawDataToWarehouseBinsEntities } from "../../../warehouse_bin/router/transformer";
import { Inventory, ReorderStatus } from "../../entity";

export function inventoryRawDatumToInventoryEntity(raw: any): Inventory {
    let inventory = new Inventory();
    //TODO: check for all fields
    if (raw === null || raw === undefined) {
        return inventory = null;
    }

    if (raw.id) {
        inventory.id = raw.id;
    }

    if (raw.product) {
        inventory.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        inventory.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    if (raw.warehouse) {
        inventory.warehouse = warehouseRawDatumToWarehouseEntity(raw.warehouse);
    }

    if (raw.warehouseBins?.length > 0) {
        inventory.warehouseBins = warehouseBinsRawDataToWarehouseBinsEntities(raw.warehouseBins);
    }

    if (raw.reorderPoint !== undefined) {
        inventory.reorderPoint = raw.reorderPoint;
    }

    if (raw.reorderQty !== undefined) {
        inventory.reorderQty = raw.reorderQty;
    }

    if (raw.maxStockLevel !== undefined) {
        inventory.maxStockLevel = raw.maxStockLevel;
    }

    if (raw.qtyOnHand !== undefined) {
        inventory.qtyOnHand = raw.qtyOnHand;
    }

    if (raw.qtyReserved !== undefined) {
        inventory.qtyReserved = raw.qtyReserved;
    }

    if (raw.qtyCommitted !== undefined) {
        inventory.qtyCommitted = raw.qtyCommitted;
    }

    if (raw.reorderOrderedQty !== undefined) {
        inventory.reorderOrderedQty = raw.reorderOrderedQty;
    }

    if (raw.reorderStatus) {
        inventory.reorderStatus = raw.reorderStatus as ReorderStatus;
    }

    if (raw.lastMovementAt) {
        inventory.lastMovementAt = raw.lastMovementAt;
    }

    if (raw.updatedAt) {
        inventory.updatedAt = raw.updatedAt;
    }

    return inventory;
}

export function inventoryRawDataToInventoryEntities(raws: any[]): Inventory[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(inventoryRawDatumToInventoryEntity);
}