import { inventoryRawDatumToInventoryEntity } from "../../../inventory/router/transformer";
import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { warehouseBinRawDatumToWarehouseBinEntity } from "../../../warehouse_bin/router/transformer";
import { BinStock } from "../../entity";

export function binStockRawDatumToBinStockEntity(raw: any): BinStock {
    let binStock = new BinStock();

    if (raw === null || raw === undefined) {
        return binStock = null;
    }

    if (raw.id) {
        binStock.id = raw.id;
    }

    if (raw.bin) {
        binStock.bin = warehouseBinRawDatumToWarehouseBinEntity(raw.bin);
    }

    if (raw.product) {
        binStock.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        binStock.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    if (raw.inventory) {
        binStock.inventory = inventoryRawDatumToInventoryEntity(raw.inventory);
    }

    if (raw.qtyOnHand !== undefined) {
        binStock.qtyOnHand = raw.qtyOnHand;
    }

    if (raw.batchNumber) {
        binStock.batchNumber = raw.batchNumber;
    }

    if (raw.expiryDate) {
        binStock.expiryDate = new Date(raw.expiryDate);
    }

    if (raw.lastCountedAt) {
        binStock.lastCountedAt = new Date(raw.lastCountedAt);
    }

    return binStock;
}

export function binStocksRawDataToBinStocksEntities(raws: any[]): BinStock[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(binStockRawDatumToBinStockEntity);
}