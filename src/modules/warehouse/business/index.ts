import { WarehousePersistor } from "../data/persistor";
import { Warehouse } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { AddressManagement } from "../../address/business";

export class WarehouseManagement {

    async createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehousePersistor = new WarehousePersistor();
                let isWarehouseWithName = await this.warehouseByName(warehouse.name);
                if (isWarehouseWithName) {
                    return reject(new ApiError("Warehouse with this Name already exists", StatusCodes.CONFLICT));
                }
                warehouse.code = await this.generateCode(warehouse.name);
                let isWarehouseWithCode = await this.warehouseByCode(warehouse.code);
                if (isWarehouseWithCode) {
                    return reject(new ApiError("Warehouse with this code already exists", StatusCodes.CONFLICT));
                }
                let address = await new AddressManagement().createAddress(warehouse.address);
                warehouse.address = address;
                let persistedWarehouse = await warehousePersistor.createWarehouse(warehouse);
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
                    return reject(new ApiError("Please Provide Warehouse Name", StatusCodes.CONFLICT));
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