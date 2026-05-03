import { BinStock } from "../../../entity";
import { inventoryRecordToInventoryEntity } from "../../../../inventory/data/persistor/transformer";
import { ObjectId } from "mongodb";
import { productRecordToProductEntity } from "../../../../product/data/persistor/transformer";
import { variantRecordToVariantEntity } from "../../../../variant/data/persistor/transformer";
import { warehouseBinRecordToWarehouseBinEntity } from "../../../../warehouse_bin/data/persistor/transformer";

export function binStockRecordToBinStockEntity(binStockRecord: any): BinStock {
    let binStock = new BinStock();

    if (binStockRecord === null || binStockRecord === undefined) {
        return binStock = null;
    }

    if (binStockRecord._id) {
        binStock.id = binStockRecord._id?.toString();
    }

    if (binStockRecord.bin) {
        binStock.bin = warehouseBinRecordToWarehouseBinEntity(binStockRecord.bin);
    }

    if (binStockRecord.product) {
        binStock.product = productRecordToProductEntity(binStockRecord.product);
    }

    if (binStockRecord.variant) {
        binStock.variant = variantRecordToVariantEntity(binStockRecord.variant);
    }

    if (binStockRecord.inventory) {
        binStock.inventory = inventoryRecordToInventoryEntity(binStockRecord.inventory);
    }

    if (binStockRecord.qtyOnHand !== undefined) {
        binStock.qtyOnHand = binStockRecord.qtyOnHand;
    }

    if (binStockRecord.batchNumber) {
        binStock.batchNumber = binStockRecord.batchNumber;
    }

    if (binStockRecord.expiryDate) {
        binStock.expiryDate = binStockRecord.expiryDate;
    }

    if (binStockRecord.lastCountedAt) {
        binStock.lastCountedAt = binStockRecord.lastCountedAt;
    }

    return binStock;
}

export function binStockEntityToBinStockRecord(binStock: BinStock): object {
    let record: any = {};

    if (binStock === null || binStock === undefined) {
        return record = null;
    }

    if (binStock.id) {
        record._id = new ObjectId(binStock.id);
    }

    if (binStock.bin?.id) {
        record.bin = new ObjectId(binStock.bin.id);
    }

    if (binStock.product?.id) {
        record.product = new ObjectId(binStock.product.id);
    }

    if (binStock.variant?.id) {
        record.variant = new ObjectId(binStock.variant.id);
    }

    if (binStock.inventory?.id) {
        record.inventory = new ObjectId(binStock.inventory.id);
    }

    if (binStock.qtyOnHand !== undefined) {
        record.qtyOnHand = binStock.qtyOnHand;
    }

    if (binStock.batchNumber) {
        record.batchNumber = binStock.batchNumber;
    }

    if (binStock.expiryDate) {
        record.expiryDate = binStock.expiryDate;
    }

    if (binStock.lastCountedAt) {
        record.lastCountedAt = binStock.lastCountedAt;
    }

    return record;
}

export function binStocksRecordsToBinStocksEntities(binStockRecords: any[]): BinStock[] {
    if (!binStockRecords || binStockRecords.length === 0) {
        return [];
    }
    return binStockRecords.map((record) => binStockRecordToBinStockEntity(record));
}

export function binStocksEntitiesToBinStocksRecords(binStocks: BinStock[]): any[] {
    if (!binStocks || binStocks.length === 0) {
        return [];
    }
    return binStocks.map((binStock) => binStockEntityToBinStockRecord(binStock));
}