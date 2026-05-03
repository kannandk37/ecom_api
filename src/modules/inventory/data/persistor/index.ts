import { Inventory } from "../../entity";
import { InventoryModel } from "../schema";
import { WarehouseModel } from "../../../warehouse/data/schema";
import {
    inventoryEntityToInventoryRecord,
    inventoryRecordToInventoryEntity,
    inventoriesRecordsToInventoriesEntities
} from "./transformer";
import { ObjectId } from "mongodb";

export class InventoryPersistor {

    private populateOptions = [
        { path: 'warehouse', model: WarehouseModel },
        { path: 'product' },
        { path: 'variant' }
    ];

    async createInventory(inventory: Inventory): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryData = inventoryEntityToInventoryRecord(inventory);
                let inventoryRecord = await InventoryModel.create(inventoryData);
                resolve(await this.inventoryById(inventoryRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventories(): Promise<Inventory[]> {
        return new Promise<Inventory[]>(async (resolve, reject) => {
            try {
                let inventoryRecords = await InventoryModel.find().populate(this.populateOptions);
                resolve(inventoriesRecordsToInventoriesEntities(inventoryRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoriesByWarehouseId(warehouseId: string): Promise<Inventory[]> {
        return new Promise<Inventory[]>(async (resolve, reject) => {
            try {
                let inventoryRecords = await InventoryModel.find({ warehouse: new ObjectId(warehouseId) }).populate(this.populateOptions);
                resolve(inventoriesRecordsToInventoriesEntities(inventoryRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoryById(id: string): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryRecord = await InventoryModel.findOne({ _id: new ObjectId(id) }).populate(this.populateOptions);
                resolve(inventoryRecordToInventoryEntity(inventoryRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoryByProductVariantWarehouse(productId: string, variantId: string, warehouseId: string): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let query: any = {
                    product: new ObjectId(productId),
                    warehouse: new ObjectId(warehouseId)
                };
                if (variantId) {
                    query.variant = new ObjectId(variantId);
                }
                let inventoryRecord = await InventoryModel.findOne(query).populate(this.populateOptions);
                resolve(inventoryRecordToInventoryEntity(inventoryRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateInventoryById(id: string, inventory: Inventory): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryData = inventoryEntityToInventoryRecord(inventory);
                await InventoryModel.updateOne({ _id: new ObjectId(id) }, { $set: inventoryData });
                resolve(await this.inventoryById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async incrementInventoryQty(id: string, qtyOnHandDelta: number, qtyCommittedDelta: number): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                await InventoryModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: { qtyOnHand: qtyOnHandDelta, qtyCommitted: qtyCommittedDelta },
                        $set: { lastMovementAt: new Date() }
                    }
                );
                resolve(await this.inventoryById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}