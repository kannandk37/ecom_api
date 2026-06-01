import { Inventory } from "../../entity";
import { InventoryModel } from "../schema";
import { WarehouseModel } from "../../../warehouse/data/schema";
import {
    inventoryEntityToInventoryRecord,
    inventoryRecordToInventoryEntity,
    inventoriesRecordsToInventoriesEntities
} from "./transformer";
import { ObjectId } from "mongodb";
import { ProductModel } from "../../../product/data/schema";
import { VariantModel } from "../../../variant/data/schema";

export class InventoryPersistor {

    private populateOptions = [
        {
            path: 'warehouse',
            model: WarehouseModel
        },
        {
            path: 'product',
            model: ProductModel,
            populate: {
                path: 'variants',
                model: VariantModel
            }
        },
        {
            path: 'variant',
            model: VariantModel
        }
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
                resolve(await inventoriesRecordsToInventoriesEntities(inventoryRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoriesByWarehouseId(warehouseId: string): Promise<Inventory[]> {
        return new Promise<Inventory[]>(async (resolve, reject) => {
            try {
                let inventoryRecords = await InventoryModel.find({ warehouse: new ObjectId(warehouseId) }).populate(this.populateOptions);
                resolve(await inventoriesRecordsToInventoriesEntities(inventoryRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoryByWarehouseIdAndProductIdAndVariantId(warehouseId: string, productId: string, variantId?: string): Promise<Inventory[]> {
        return new Promise<Inventory[]>(async (resolve, reject) => {
            try {
                let query: any = {
                    warehouse: new ObjectId(warehouseId),
                    product: new ObjectId(productId)
                };

                if (variantId) {
                    query.variantId = new ObjectId(variantId)
                }

                let inventoryRecords = await InventoryModel.find(query).populate(this.populateOptions);
                resolve(await inventoriesRecordsToInventoriesEntities(inventoryRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoriesByWarehouseProductVariant(warehouseId: string, productId: string, variantId?: string): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let query: any = {
                    warehouse: new ObjectId(warehouseId),
                    product: new ObjectId(productId)
                };

                if (variantId) {
                    query['variant'] = new ObjectId(variantId)
                };

                let inventoryRecord = await InventoryModel.findOne(query).populate(this.populateOptions);
                resolve(await inventoryRecordToInventoryEntity(inventoryRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoryById(id: string): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let inventoryRecord = await InventoryModel.findOne({ _id: new ObjectId(id) }).populate(this.populateOptions);
                resolve(await inventoryRecordToInventoryEntity(inventoryRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async inventoryByProductWarehouseVariant(productId: string, warehouseId: string, variantId: string): Promise<Inventory> {
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
                resolve(await inventoryRecordToInventoryEntity(inventoryRecord));
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

    async incrementInventoryQty(id: string, qtyOnHandDelta?: number, qtyCommittedDelta?: number, totalDamaged?: number, totalSold?: number): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                let incrementalValue: any = {};
                if (qtyOnHandDelta) {
                    incrementalValue.qtyOnHandDelta = qtyOnHandDelta;
                }
                if (qtyCommittedDelta) {
                    incrementalValue.qtyCommittedDelta = qtyCommittedDelta;
                }
                if (totalDamaged) {
                    incrementalValue.totalDamaged = totalDamaged;
                }
                if (totalSold) {
                    incrementalValue.totalSold = totalSold;
                }

                await InventoryModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: incrementalValue,
                        $set: { lastMovementAt: new Date() }
                    }
                );
                resolve(await this.inventoryById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async decrementInventoryQty(id: string, delta: number): Promise<Inventory> {
        return new Promise<Inventory>(async (resolve, reject) => {
            try {
                await InventoryModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: { qtyOnHand: -delta },
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