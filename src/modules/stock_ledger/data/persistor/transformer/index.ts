import { StockLedger } from "../../../entity";
import { warehouseRecordToWarehouseEntity } from "../../../../warehouse/data/persistor/transformer";
import { warehouseBinRecordToWarehouseBinEntity } from "../../../../warehouse_bin/data/persistor/transformer";
import { inventoryRecordToInventoryEntity } from "../../../../inventory/data/persistor/transformer";
import { binStockRecordToBinStockEntity } from "../../../../bin_stock/data/persistor/transformer";
import { ObjectId } from "mongodb";
import { variantRecordToVariantEntity } from "../../../../variant/data/persistor/transformer";
import { productRecordToProductEntity } from "../../../../product/data/persistor/transformer";

export function stockLedgerRecordToStockLedgerEntity(stockLedgerRecord: any): StockLedger {
    let stockLedger = new StockLedger();

    if (stockLedgerRecord === null || stockLedgerRecord === undefined) {
        return stockLedger = null;
    }

    if (stockLedgerRecord._id) {
        stockLedger.id = stockLedgerRecord._id?.toString();
    }

    if (stockLedgerRecord.inventory) {
        stockLedger.inventory = inventoryRecordToInventoryEntity(stockLedgerRecord.inventory);
    }

    if (stockLedgerRecord.warehouse) {
        stockLedger.warehouse = warehouseRecordToWarehouseEntity(stockLedgerRecord.warehouse);
    }

    if (stockLedgerRecord.bin) {
        stockLedger.bin = warehouseBinRecordToWarehouseBinEntity(stockLedgerRecord.bin);
    }

    if (stockLedgerRecord.binStock) {
        stockLedger.binStock = binStockRecordToBinStockEntity(stockLedgerRecord.binStock);
    }

    if (stockLedgerRecord.product) {
        stockLedger.product = productRecordToProductEntity(stockLedgerRecord.product);
    }

    if (stockLedgerRecord.variant) {
        stockLedger.variant = variantRecordToVariantEntity(stockLedgerRecord.variant);
    }

    if (stockLedgerRecord.movementType) {
        stockLedger.movementType = stockLedgerRecord.movementType;
    }

    if (stockLedgerRecord.quantityDelta !== undefined) {
        stockLedger.quantityDelta = stockLedgerRecord.quantityDelta;
    }

    if (stockLedgerRecord.qtyBefore !== undefined) {
        stockLedger.qtyBefore = stockLedgerRecord.qtyBefore;
    }

    if (stockLedgerRecord.qtyAfter !== undefined) {
        stockLedger.qtyAfter = stockLedgerRecord.qtyAfter;
    }

    if (stockLedgerRecord.referenceType) {
        stockLedger.referenceType = stockLedgerRecord.referenceType;
    }

    if (stockLedgerRecord.referenceId) {
        stockLedger.referenceId = stockLedgerRecord.referenceId;
    }

    if (stockLedgerRecord.notes) {
        stockLedger.notes = stockLedgerRecord.notes;
    }

    if (stockLedgerRecord.performedBy) {
        stockLedger.performedBy = stockLedgerRecord.performedBy;
    }

    if (stockLedgerRecord.createdAt) {
        stockLedger.createdAt = stockLedgerRecord.createdAt;
    }

    return stockLedger;
}

export function stockLedgerEntityToStockLedgerRecord(stockLedger: StockLedger): object {
    let record: any = {};

    if (stockLedger === null || stockLedger === undefined) {
        return record = null;
    }

    if (stockLedger.inventory?.id) {
        record.inventory = new ObjectId(stockLedger.inventory.id);
    }

    if (stockLedger.warehouse?.id) {
        record.warehouse = new ObjectId(stockLedger.warehouse.id);
    }

    if (stockLedger.bin?.id) {
        record.bin = new ObjectId(stockLedger.bin.id);
    }

    if (stockLedger.binStock?.id) {
        record.binStock = new ObjectId(stockLedger.binStock.id);
    }

    if (stockLedger.product?.id) {
        record.product = new ObjectId(stockLedger.product.id);
    }

    if (stockLedger.variant?.id) {
        record.variant = new ObjectId(stockLedger.variant.id);
    }

    if (stockLedger.movementType) {
        record.movementType = stockLedger.movementType;
    }

    if (stockLedger.quantityDelta !== undefined) {
        record.quantityDelta = stockLedger.quantityDelta;
    }

    if (stockLedger.qtyBefore !== undefined) {
        record.qtyBefore = stockLedger.qtyBefore;
    }

    if (stockLedger.qtyAfter !== undefined) {
        record.qtyAfter = stockLedger.qtyAfter;
    }

    if (stockLedger.referenceType) {
        record.referenceType = stockLedger.referenceType;
    }

    if (stockLedger.referenceId) {
        record.referenceId = stockLedger.referenceId;
    }

    if (stockLedger.notes) {
        record.notes = stockLedger.notes;
    }

    if (stockLedger.performedBy) {
        record.performedBy = stockLedger.performedBy;
    }

    return record;
}

export function stockLedgersRecordsToStockLedgersEntities(stockLedgerRecords: any[]): StockLedger[] {
    if (!stockLedgerRecords || stockLedgerRecords.length === 0) {
        return [];
    }
    return stockLedgerRecords.map((record) => stockLedgerRecordToStockLedgerEntity(record));
}

export function stockLedgersEntitiesToStockLedgersRecords(stockLedgers: StockLedger[]): any[] {
    if (!stockLedgers || stockLedgers.length === 0) {
        return [];
    }
    return stockLedgers.map((stockLedger) => stockLedgerEntityToStockLedgerRecord(stockLedger));
}