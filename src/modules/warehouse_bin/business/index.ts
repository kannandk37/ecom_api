import { WarehouseBinPersistor } from "../data/persistor";
import { WarehouseBin } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { BinStockPersistor } from "../../bin_stock/data/persistor";
import { Product } from "../../product/entity";
import { Warehouse } from "../../warehouse/entity";
import { Variant } from "../../variant/entity";
import { InventoryManagement } from "../../inventory/business";

export class WarehouseBinManagement {

    async createWarehouseBin(warehouseBin: WarehouseBin): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                let isBinWithCode = await this.warehouseBinByCode(warehouseBin.binCode);
                if (isBinWithCode) {
                    return reject(new ApiError("Warehouse bin with this code already exists", StatusCodes.CONFLICT, true));
                }
                let persistedBin = await warehouseBinPersistor.createWarehouseBin(warehouseBin);
                resolve(persistedBin);
            } catch (error) {
                reject(error);
            }
        });
    }

    async allocateWarehouseBins(warehouse: Warehouse, product: Product, quantity: number, variant: Variant): Promise<{
        success: boolean,
        allocations: WarehouseBin[],
        totalAllocated: number,
        shortfall: number,
        transferSuggestions: WarehouseBin[],
    }> {
        return new Promise<{
            success: boolean,
            allocations: WarehouseBin[],
            totalAllocated: number,
            shortfall: number,
            transferSuggestions: WarehouseBin[],
        }>(async (resolve, reject) => {
            try {
                let isExistingInventoryForProduct = await new InventoryManagement().inventoriesByWarehouseProductVariant(warehouse?.id, product?.id, variant?.id);
                if (isExistingInventoryForProduct) {
                    return reject(new ApiError(`Product Already Exists, Please Use Adjust Stock`, StatusCodes.BAD_REQUEST, true));
                }
                let warehouseBins = await this.warehouseBinsByWarehouseId(warehouse?.id);
                if (warehouseBins?.length == 0) {
                    return new ApiError('No Bins Exists For This Warehouse', StatusCodes.NOT_FOUND, true);
                }
                //TODO: if need we can allocate the products by checking if this warehouse bin is for the product and variant
                let availableBins = warehouseBins.filter((warehousebin: WarehouseBin) => warehousebin.isActive && !warehousebin.isOccupied && (warehousebin.maxUnits ?? 0) - (warehousebin.currentStock ?? 0) > 0)

                if (availableBins?.length == 0) {
                    return new ApiError('There Is No Empty Bins Exists For This Warehouse', StatusCodes.NOT_FOUND, true);
                }

                const totalFreeSpace = availableBins.reduce((sum, bin) => {
                    return sum + ((bin.maxUnits ?? 0) - (bin.currentStock ?? 0));
                }, 0);

                let message = ''
                if (totalFreeSpace < quantity) {
                    message = 'Unable TO Fill Full Quantity';
                }

                const sortedBins = [...availableBins].sort((a, b) => {
                    const aisleComp = (a.aisle ?? '').localeCompare(b.aisle ?? '');
                    if (aisleComp !== 0) return aisleComp;

                    const rackComp = (a.rack ?? '').localeCompare(b.rack ?? '');
                    if (rackComp !== 0) return rackComp;

                    const levelComp = (a.level ?? '').localeCompare(b.level ?? '');
                    if (levelComp !== 0) return levelComp;

                    return (a.position ?? '').localeCompare(b.position ?? '');
                });

                const allocations: WarehouseBin[] = [];
                let remaining = quantity;

                for (const bin of sortedBins) {
                    if (remaining <= 0) break;

                    const freeSpace = (bin.maxUnits ?? 0) - (bin.currentStock ?? 0);
                    const toAllocate = Math.min(freeSpace, remaining);
                    let isFullyOccupied = (toAllocate + bin.currentStock) > bin.maxUnits ? true : false;
                    allocations.push({
                        ...bin,
                        currentStock: toAllocate,
                        isOccupied: isFullyOccupied,
                    });

                    remaining -= toAllocate;
                }

                if (remaining === 0) {
                    return resolve({
                        success: true,
                        allocations,
                        totalAllocated: quantity,
                        shortfall: 0,
                        transferSuggestions: [],
                    });
                }
                let remainingWarehouseBins = new Set(allocations.map(a => a.id));

                const transferCandidates = allocations
                    .filter(bin =>
                        bin.isActive &&
                        !bin.isOccupied &&
                        !remainingWarehouseBins.has(bin.id) &&
                        (bin.currentStock ?? 0) > (bin.minThreshold ?? 0)
                    )
                    .sort((a, b) => {
                        const aTransferable = (a.currentStock ?? 0) - (a.minThreshold ?? 0);
                        const bTransferable = (b.currentStock ?? 0) - (b.minThreshold ?? 0);
                        return bTransferable - aTransferable;
                    });

                const transferSuggestions: WarehouseBin[] = [];

                let couldFree = 0;

                for (const bin of transferCandidates) {
                    if (couldFree >= remaining) break;

                    const transferable = (bin.currentStock ?? 0) - (bin.minThreshold ?? 0);

                    transferSuggestions.push(bin);

                    couldFree += transferable;
                }
                return resolve({
                    success: false,
                    allocations,
                    totalAllocated: quantity - remaining,
                    shortfall: remaining,
                    transferSuggestions,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async createWarehouseBins(warehouseBins: WarehouseBin[]): Promise<WarehouseBin[]> {
        return new Promise<WarehouseBin[]>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                let binCodes = warehouseBins.map((warehouseBin: WarehouseBin) => warehouseBin.binCode);

                let isBinWithCodes = await this.warehouseBinByCodes(binCodes);
                if (isBinWithCodes?.length > 0) {
                    return reject(new ApiError("Warehouse bin with this code already exists", StatusCodes.CONFLICT, true));
                }
                let persistedBins = await warehouseBinPersistor.createWarehouseBins(warehouseBins);
                resolve(persistedBins);
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinByCode(bincode: string): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                resolve(await warehouseBinPersistor.warehouseBinByCode(bincode));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinByCodes(bincodes: string[]): Promise<WarehouseBin[]> {
        return new Promise<WarehouseBin[]>(async (resolve, reject) => {
            try {
                let warehouseBinPersistor = new WarehouseBinPersistor();
                resolve(await warehouseBinPersistor.warehouseBinByCodes(bincodes));
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
                    return reject(new ApiError("Warehouse bin not found", StatusCodes.NOT_FOUND, true));
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
                    return reject(new ApiError("Warehouse bin not found", StatusCodes.NOT_FOUND, true));
                }
                // Guard: cannot deactivate a bin that still has stock
                if (warehouseBin.isActive === false && existingBin.isActive === true) {
                    let binStockPersistor = new BinStockPersistor();
                    let activeBinStocks = await binStockPersistor.binStocksByBinId(id);
                    let hasStock = activeBinStocks.some(bs => bs.qtyOnHand > 0);
                    if (hasStock) {
                        return reject(new ApiError("Cannot deactivate bin with active stock. Clear or move stock first.", StatusCodes.BAD_REQUEST, true));
                    }
                }
                if (warehouseBin.binCode && warehouseBin.binCode !== existingBin.binCode) {
                    let isBinWithCode = await warehouseBinPersistor.warehouseBinByCode(warehouseBin.binCode);
                    if (isBinWithCode) {
                        return reject(new ApiError("Warehouse bin with this code already exists", StatusCodes.CONFLICT, true));
                    }
                }
                resolve(await warehouseBinPersistor.updateWarehouseBinById(id, warehouseBin));
            } catch (error) {
                reject(error);
            }
        });
    }
}