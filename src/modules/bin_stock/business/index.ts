import { StatusCodes } from "http-status-codes";
import { BinStockPersistor } from "../data/persistor";
import ApiError from "../../../exceptions/apierror";
import { BinStock } from "../entity";

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
                if (!binStock) {
                    return reject(new ApiError("Bin stock not found", StatusCodes.NOT_FOUND));
                }
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
}