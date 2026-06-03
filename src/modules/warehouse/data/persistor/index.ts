import { ProfileModel } from "../../../profile/data/schema";
import { Warehouse } from "../../entity";
import { WarehouseModel } from "../schema";
import {
    warehouseEntityToWarehouseRecord,
    warehouseRecordToWarehouseEntity,
    warehousesRecordsToWarehousesEntities
} from "./transformer";
import { ObjectId } from "mongodb";

export class WarehousePersistor {

    async createWarehouse(warehouse: Warehouse): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehouseData = warehouseEntityToWarehouseRecord(warehouse);
                let warehouseRecord = await WarehouseModel.create(warehouseData);
                resolve(warehouseRecordToWarehouseEntity(warehouseRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouses(): Promise<Warehouse[]> {
        return new Promise<Warehouse[]>(async (resolve, reject) => {
            try {
                let warehouseRecords = await WarehouseModel.find().populate('warehouseBins').populate({path: 'operator', model: ProfileModel});
                resolve(warehousesRecordsToWarehousesEntities(warehouseRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseById(id: string): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehouseRecord = await WarehouseModel.findOne({ _id: new ObjectId(id) }).populate('warehouseBins').populate({path: 'operator', model: ProfileModel});
                resolve(warehouseRecordToWarehouseEntity(warehouseRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseByCode(code: string): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehouseRecord = await WarehouseModel.findOne({ code: code }).populate('warehouseBins').populate({path: 'operator', model: ProfileModel});
                resolve(warehouseRecordToWarehouseEntity(warehouseRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseByName(name: string): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehouseRecord = await WarehouseModel.findOne({ name: name }).populate('warehouseBins').populate({path: 'operator', model: ProfileModel});
                resolve(warehouseRecordToWarehouseEntity(warehouseRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateWarehouseById(id: string, warehouse: Warehouse): Promise<Warehouse> {
        return new Promise<Warehouse>(async (resolve, reject) => {
            try {
                let warehouseData = warehouseEntityToWarehouseRecord(warehouse);
                await WarehouseModel.updateOne({ _id: new ObjectId(id) }, warehouseData);
                resolve(await this.warehouseById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}