import { WarehouseBinPersistor } from "../data/persistor";
import { WarehouseBin } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { BinStockPersistor } from "../../bin_stock/data/persistor";

export class WarehouseBinManagement {

    async createWarehouseBin(warehouseBin: WarehouseBin): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                let isBinWithCode = await warehouseBinPersistor.warehouseBinByCode(warehouseBin.binCode);
                if (isBinWithCode) {
                    return reject(new ApiError("Warehouse bin with this code already exists", StatusCodes.CONFLICT));
                }
                let persistedBin = await warehouseBinPersistor.createWarehouseBin(warehouseBin);
                resolve(await this.warehouseBinById(persistedBin.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBins(): Promise<WarehouseBin[]> {
        return new Promise<WarehouseBin[]>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                resolve(await warehouseBinPersistor.warehouseBins());
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinsByWarehouseId(warehouseId: string): Promise<WarehouseBin[]> {
        return new Promise<WarehouseBin[]>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                resolve(await warehouseBinPersistor.warehouseBinsByWarehouseId(warehouseId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinById(id: string): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                let warehouseBin = await warehouseBinPersistor.warehouseBinById(id);
                if (!warehouseBin) {
                    return reject(new ApiError("Warehouse bin not found", StatusCodes.NOT_FOUND));
                }
                resolve(warehouseBin);
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateWarehouseBinById(id: string, warehouseBin: WarehouseBin): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                let existingBin = await this.warehouseBinById(id);
                if (!existingBin) {
                    return reject(new ApiError("Warehouse bin not found", StatusCodes.NOT_FOUND));
                }
                // Guard: cannot deactivate a bin that still has stock
                if (warehouseBin.isActive === false && existingBin.isActive === true) {
                    let binStockPersistor = new BinStockPersistor();
                    let activeBinStocks = await binStockPersistor.binStocksByBinId(id);
                    let hasStock = activeBinStocks.some(bs => bs.qtyOnHand > 0);
                    if (hasStock) {
                        return reject(new ApiError("Cannot deactivate bin with active stock. Clear or move stock first.", StatusCodes.BAD_REQUEST));
                    }
                }
                if (warehouseBin.binCode && warehouseBin.binCode !== existingBin.binCode) {
                    let isBinWithCode = await warehouseBinPersistor.warehouseBinByCode(warehouseBin.binCode);
                    if (isBinWithCode) {
                        return reject(new ApiError("Warehouse bin with this code already exists", StatusCodes.CONFLICT));
                    }
                }
                resolve(await warehouseBinPersistor.updateWarehouseBinById(id, warehouseBin));
            } catch (error) {
                reject(error);
            }
        });
    }
}