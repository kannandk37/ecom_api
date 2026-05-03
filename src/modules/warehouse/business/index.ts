import { WarehousePersistor } from "../data/persistor";
import { Warehouse } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";

export class WarehouseManagement {

    async createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                let isWarehouseWithCode = await this.warehouseByCode(warehouse.code);
                if (isWarehouseWithCode) {
                    return reject(new ApiError("Warehouse with this code already exists", StatusCodes.CONFLICT));
                }
                let persistedWarehouse = await warehousePersistor.createWarehouse(warehouse);
                resolve(await this.warehouseById(persistedWarehouse.id));
            } catch (error) {
                reject(error);
            }
        });
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
                    return reject(new ApiError("Warehouse not found", StatusCodes.NOT_FOUND));
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

    async updateWarehouseById(id: string, warehouse: Warehouse): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                let existingWarehouse = await this.warehouseById(id);
                if (!existingWarehouse) {
                    return reject(new ApiError("Warehouse not found", StatusCodes.NOT_FOUND));
                }
                if (warehouse.code && warehouse.code !== existingWarehouse.code) {
                    let isWarehouseWithCode = await this.warehouseByCode(warehouse.code);
                    if (isWarehouseWithCode) {
                        return reject(new ApiError("Warehouse with this code already exists", StatusCodes.CONFLICT));
                    }
                }
                resolve(await warehousePersistor.updateWarehouseById(id, warehouse));
            } catch (error) {
                reject(error);
            }
        });
    }
}