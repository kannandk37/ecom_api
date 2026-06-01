import { WarehousePersistor } from "../data/persistor";
import { Warehouse } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { AddressManagement } from "../../address/business";
import { WarehouseBin } from "../../warehouse_bin/entity";
import { WarehouseBinManagement } from "../../warehouse_bin/business";
import { InventoryManagement } from "../../inventory/business";

export class WarehouseManagement {

    async createWarehouseAndEssentials(warehouse: Warehouse, warehouseBins: WarehouseBin[]): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let totalBinQuantity = warehouseBins?.reduce((sum: number, warehouse: WarehouseBin) => sum + warehouse.maxUnits, 0);
                if (totalBinQuantity > warehouse.totalCapacity) {
                    return reject(new ApiError("Warehouse Bin Quantity Is Higher Than The Warehouse Max Qty", StatusCodes.BAD_REQUEST, true));
                }
                let warehousePersistor = new WarehousePersistor();
                let isWarehouseWithName = await this.warehouseByName(warehouse.name);
                if (isWarehouseWithName) {
                    return reject(new ApiError("Warehouse with this Name already exists", StatusCodes.CONFLICT, true));
                }
                warehouse.code = await this.generateCode(warehouse.name);
                let isWarehouseWithCode = await this.warehouseByCode(warehouse.code);
                if (isWarehouseWithCode) {
                    return reject(new ApiError("Warehouse with this code already exists", StatusCodes.CONFLICT, true));
                }

                let warehouseBinsWithBinCodes = await new WarehouseBinManagement().warehouseBinByCodes(warehouseBins.map((el) => el.binCode));
                if(warehouseBinsWithBinCodes?.length > 0) {
                    return reject(new ApiError("Warehouse Bins with this Bin Code already exists", StatusCodes.CONFLICT, true));
                }

                let address = await new AddressManagement().createAddress(warehouse.address);
                warehouse.address = address;
                let persistedWarehouse = await warehousePersistor.createWarehouse(warehouse);

                // const warehouseBins: WarehouseBin[] = [];

                // for (let a = 1; a <= Number(warehouseBin.aisle ?? 1); a++) {
                //     for (let r = 1; r <= Number(warehouseBin.rack ?? 1); r++) {
                //         for (let l = 1; l <= Number(warehouseBin.level ?? 1); l++) {
                //             for (let p = 1; p <= Number(warehouseBin.position ?? 1); p++) {

                //                 const aisle = `A${String(a).padStart(2, '0')}`;  // A01
                //                 const rack = `R${String(r).padStart(2, '0')}`;  // R02
                //                 const level = `L${l}`;                           // L3
                //                 const pos = `P${p}`;                           // P4

                //                 warehouseBins.push({
                //                     warehouse: { id: warehouse.id },
                //                     binCode: `${aisle}-${rack}-${level}-${pos}`, // A01-R02-L3-P4
                //                     aisle,
                //                     rack,
                //                     level,
                //                     position: pos,
                //                     maxUnits: warehouseBin.maxUnits ?? 200,
                //                     isActive: true,
                //                 });
                //             }
                //         }
                //     }
                // }

                await new WarehouseBinManagement().createWarehouseBins(warehouseBins.map((el) => { return { ...el, warehouse: persistedWarehouse } }));

                resolve(await this.warehouseById(persistedWarehouse.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateCode(warehouseName: string): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                if (warehouseName) {
                    resolve(warehouseName.match(/\b\w/g).join('').toUpperCase());
                } else {
                    return reject(new ApiError("Please Provide Warehouse Name", StatusCodes.CONFLICT, true));
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    async warehouses(): Promise<Warehouse[]> {
        return new Promise<Warehouse[]>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                resolve(await warehousePersistor.warehouses());
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseById(id: string): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                let warehouse = await warehousePersistor.warehouseById(id);
                if (!warehouse) {
                    return reject(new ApiError("Warehouse not found", StatusCodes.NOT_FOUND, true));
                }
                resolve(warehouse);
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseByCode(code: string): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                resolve(await warehousePersistor.warehouseByCode(code));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseByName(name: string): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                resolve(await warehousePersistor.warehouseByName(name));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateWarehouseAndEssentialsByWarehouseId(id: string, warehouse: Warehouse, warehouseBins: WarehouseBin[]): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                let existingWarehouse = await this.warehouseById(id);
                if (!existingWarehouse) {
                    return reject(new ApiError("Warehouse not found", StatusCodes.NOT_FOUND, true));
                }
                if (warehouse.code && warehouse.code !== existingWarehouse.code) {
                    let isWarehouseWithCode = await this.warehouseByCode(warehouse.code);
                    if (isWarehouseWithCode) {
                        return reject(new ApiError("Warehouse with this code already exists", StatusCodes.CONFLICT, true));
                    }
                }
                resolve(await warehousePersistor.updateWarehouseById(id, warehouse));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseDetails(): Promise<{
        warehouse: Warehouse,
        warehouseBins: WarehouseBin[],
        totalWareHouseBins: number;
        totalCapacitySpace: number;
        totalAvailableSpace: number;
        totalOccupiedSpace: number;
        noOfProducts: number
    }[]> {
        return new Promise<{
            warehouse: Warehouse,
            warehouseBins: WarehouseBin[],
            totalWareHouseBins: number;
            totalCapacitySpace: number;
            totalAvailableSpace: number;
            totalOccupiedSpace: number;
            noOfProducts: number
        }[]>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                let warehouses = await warehousePersistor.warehouses();
                let result: {
                    warehouse: Warehouse,
                    warehouseBins: WarehouseBin[],
                    totalWareHouseBins: number;
                    totalCapacitySpace: number;
                    totalAvailableSpace: number;
                    totalOccupiedSpace: number;
                    noOfProducts: number
                }[] = [];
                if (warehouses?.length) {
                    for (const warehouse of warehouses) {

                        let capacity = warehouse.warehouseBins?.reduce((sum: number, warehouseBin: WarehouseBin) => { return sum + (warehouseBin.maxUnits ?? 0) }, 0);
                        let occupied = warehouse.warehouseBins?.reduce((sum: number, warehouseBin: WarehouseBin) => { return sum + (warehouseBin.currentStock ?? 0) }, 0);
                        let inventories = await new InventoryManagement().inventoriesByWarehouseId(warehouse?.id);
                        let uniqueProductCount = new Set(inventories.map(inventory => inventory.product?.id)).size;

                        let datum: {
                            warehouse: Warehouse,
                            warehouseBins: WarehouseBin[],
                            totalWareHouseBins: number;
                            totalCapacitySpace: number;
                            totalAvailableSpace: number;
                            totalOccupiedSpace: number;
                            noOfProducts: number
                        } = {
                            warehouse: warehouse,
                            warehouseBins: warehouse.warehouseBins,
                            totalWareHouseBins: warehouse.warehouseBins?.length ?? 0,
                            totalCapacitySpace: capacity,
                            totalAvailableSpace: (capacity - occupied),
                            totalOccupiedSpace: occupied,
                            noOfProducts: uniqueProductCount
                        }
                        result.push(datum);
                    }
                }
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
}