import { binStockRawDatumToBinStockEntity } from "../../../bin_stock/router/transformer";
import { inventoryRawDatumToInventoryEntity } from "../../../inventory/router/transformer";
import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { warehouseRawDatumToWarehouseEntity } from "../../../warehouse/router/transformer";
import { warehouseBinRawDatumToWarehouseBinEntity } from "../../../warehouse_bin/router/transformer";
import { MovementType, ReferenceType, StockLedger } from "../../entity";

export function stockLedgerRawDatumToStockLedgerEntity(raw: any): StockLedger {
    let stockLedger = new StockLedger();

    if (raw === null || raw === undefined) {
        return stockLedger = null;
    }

    if (raw.id) {
        stockLedger.id = raw.id;
    }

    if (raw.inventory) {
        stockLedger.inventory = inventoryRawDatumToInventoryEntity(raw.inventory);
    }

    if (raw.warehouse) {
        stockLedger.warehouse = warehouseRawDatumToWarehouseEntity(raw.warehouse);
    }

    if (raw.bin) {
        stockLedger.bin = warehouseBinRawDatumToWarehouseBinEntity(raw.bin);
    }

    if (raw.binStock) {
        stockLedger.binStock = binStockRawDatumToBinStockEntity(raw.binStock);
    }

    if (raw.product) {
        stockLedger.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        stockLedger.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    if (raw.movementType) {
        stockLedger.movementType = raw.movementType as MovementType;
    }

    if (raw.quantityDelta !== undefined) {
        stockLedger.quantityDelta = raw.quantityDelta;
    }

    if (raw.qtyBefore !== undefined) {
        stockLedger.qtyBefore = raw.qtyBefore;
    }

    if (raw.qtyAfter !== undefined) {
        stockLedger.qtyAfter = raw.qtyAfter;
    }

    if (raw.referenceType) {
        stockLedger.referenceType = raw.referenceType as ReferenceType;
    }

    if (raw.referenceId) {
        stockLedger.referenceId = raw.referenceId;
    }

    if (raw.notes) {
        stockLedger.notes = raw.notes;
    }

    if (raw.performedBy) {
        stockLedger.performedBy = raw.performedBy;
    }

    if (raw.createdAt) {
        stockLedger.createdAt = raw.createdAt;
    }

    return stockLedger;
}

export function stockLedgerRawDataToStockLedgerEntities(raws: any[]): StockLedger[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(stockLedgerRawDatumToStockLedgerEntity)
}