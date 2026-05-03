import { StatusCodes } from "http-status-codes";
import { BinStockPersistor } from "../data/persistor";
import ApiError from "../../../exceptions/apierror";
import { BinStock } from "../entity";

export class BinStockManagement {

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