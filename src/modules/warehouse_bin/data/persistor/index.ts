import { WarehouseBin } from "../../entity";
import { WarehouseBinModel } from "../schema";
import { WarehouseModel } from "../../../warehouse/data/schema";
import {
    warehouseBinEntityToWarehouseBinRecord,
    warehouseBinRecordToWarehouseBinEntity,
    warehouseBinsRecordsToWarehouseBinsEntities
} from "./transformer";
import { ObjectId } from "mongodb";

export class WarehouseBinPersistor {

    async createWarehouseBin(warehouseBin: WarehouseBin): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinData = warehouseBinEntityToWarehouseBinRecord(warehouseBin);
                let warehouseBinRecord = await WarehouseBinModel.create(warehouseBinData);
                resolve(await this.warehouseBinById(warehouseBinRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBins(): Promise<WarehouseBin[]> {
        return new Promise<WarehouseBin[]>(async (resolve, reject) => {
            try {
                let warehouseBinRecords = await WarehouseBinModel.find().populate({
                    path: 'warehouse', model: WarehouseModel
                });
                resolve(warehouseBinsRecordsToWarehouseBinsEntities(warehouseBinRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinsByWarehouseId(warehouseId: string): Promise<WarehouseBin[]> {
        return new Promise<WarehouseBin[]>(async (resolve, reject) => {
            try {
                let warehouseBinRecords = await WarehouseBinModel.find({ warehouse: new ObjectId(warehouseId) }).populate({
                    path: 'warehouse', model: WarehouseModel
                });
                resolve(warehouseBinsRecordsToWarehouseBinsEntities(warehouseBinRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinById(id: string): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinRecord = await WarehouseBinModel.findOne({ _id: new ObjectId(id) }).populate({
                    path: 'warehouse', model: WarehouseModel
                });
                resolve(warehouseBinRecordToWarehouseBinEntity(warehouseBinRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async warehouseBinByCode(binCode: string): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinRecord = await WarehouseBinModel.findOne({ binCode: binCode }).populate({
                    path: 'warehouse', model: WarehouseModel
                });
                resolve(warehouseBinRecordToWarehouseBinEntity(warehouseBinRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateWarehouseBinById(id: string, warehouseBin: WarehouseBin): Promise<WarehouseBin> {
        return new Promise<WarehouseBin>(async (resolve, reject) => {
            try {
                let warehouseBinData = warehouseBinEntityToWarehouseBinRecord(warehouseBin);
                await WarehouseBinModel.updateOne({ _id: new ObjectId(id) }, warehouseBinData);
                resolve(await this.warehouseBinById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}