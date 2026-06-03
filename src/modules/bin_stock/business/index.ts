import { StatusCodes } from "http-status-codes";
import { BinStockPersistor } from "../data/persistor";
import ApiError from "../../../exceptions/apierror";
import { BinStock } from "../entity";
import { binStockEntityToBinStockRecord } from "../data/persistor/transformer";
import { WarehouseManagement } from "../../warehouse/business";
import { WarehouseBin } from "../../warehouse_bin/entity";

export class BinStockManagement {

    async createBinStock(binStockInfo: BinStock): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStock = await new BinStockPersistor().createBinStock(binStockInfo);
                resolve(await this.binStockById(binStock.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStockById(id: string): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                let binStock = await binStockPersistor.binStockById(id);
                resolve(binStock);
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseBinAndProduct(warehouseBinId: string, productId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                let binStocks = await binStockPersistor.binStocksByWarehouseBinAndProduct(warehouseBinId, productId);
                resolve(binStocks);
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseBinAndProductAndVariant(warehouseBinId: string, productId: string, variantId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                let binStocks = await binStockPersistor.binStocksByWarehouseBinAndProductAndVariant(warehouseBinId, productId, variantId);
                resolve(binStocks);
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseAndProductAndVariant(warehouseId: string, productId: string, variantId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let warehouse = await new WarehouseManagement().warehouseById(warehouseId);
                if (!warehouse) {
                    return reject(new ApiError("Warehouse not found", StatusCodes.NOT_FOUND, true));
                }
                let binStockPersistor = new BinStockPersistor();
                let binStocks = await binStockPersistor.binStocksByWarehouseBinsAndProductAndVariant(warehouse.warehouseBins.map((warehouseBin: WarehouseBin) => warehouseBin.id), productId, variantId);
                resolve(binStocks);
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouse(warehouseId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let warehouse = await new WarehouseManagement().warehouseById(warehouseId);
                if (!warehouse) {
                    return reject(new ApiError("Warehouse not found", StatusCodes.NOT_FOUND, true));
                }
                let binStockPersistor = new BinStockPersistor();
                let binStocks = await binStockPersistor.binStocksByWarehouseBins(warehouse.warehouseBins.map((warehouseBin: WarehouseBin) => warehouseBin.id));
                resolve(binStocks);
            } catch (error) {
                reject(error);
            }
        });
    }

    async lastCreatedBinStock(): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                let binStock = await binStockPersistor.lastCreatedBinStock();
                resolve(binStock);
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByBinId(binId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                resolve(await binStockPersistor.binStocksByBinId(binId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStockByBinAndBatch(binId: string, inventoryId: string, batchNumber: string): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStock = await new BinStockPersistor().binStockByBinAndBatch(binId, inventoryId, batchNumber);
                resolve(binStock);
            } catch (error) {
                reject(error);
            }
        });
    }

    async incrementBinStockQty(id: string, delta: number): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                resolve(await new BinStockPersistor().incrementBinStockQty(id, delta));
            } catch (error) {
                reject(error);
            }
        });
    }

    async decrementBinStockQty(id: string, delta: number): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                resolve(await new BinStockPersistor().decrementBinStockQty(id, delta));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByInventoryId(inventoryId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                resolve(await binStockPersistor.binStocksByInventoryId(inventoryId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateBinStockById(id: string, binstock: BinStock): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockData = binStockEntityToBinStockRecord(binstock);
                let binStockPersistor = new BinStockPersistor();
                await binStockPersistor.updateBinStockById(id, binStockData);
                resolve(await this.binStockById(id));
            } catch (error) {
                reject(error);
            }
        })
    }

    async deleteById(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let binStockPersistor = new BinStockPersistor();
                await binStockPersistor.deleteById(id);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }
}