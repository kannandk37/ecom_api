import { BinStock } from "../../entity";
import { BinStockModel } from "../schema";
import { WarehouseBinModel } from "../../../warehouse_bin/data/schema";
import { InventoryModel } from "../../../inventory/data/schema";
import {
    binStockEntityToBinStockRecord,
    binStockRecordToBinStockEntity,
    binStocksRecordsToBinStocksEntities
} from "./transformer";
import { ObjectId } from "mongodb";
import { WarehouseModel } from "../../../warehouse/data/schema";

export class BinStockPersistor {

    private populateOptions = [
        { path: 'bin', model: WarehouseBinModel, populate: { path: 'warehouse', model: WarehouseModel } },
        { path: 'inventory', model: InventoryModel },
        { path: 'product' },
        { path: 'variant' }
    ];

    async createBinStock(binStock: BinStock): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockData = binStockEntityToBinStockRecord(binStock);
                let binStockRecord = await BinStockModel.create(binStockData);
                resolve(await this.binStockById(binStockRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStockById(id: string): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockRecord = await BinStockModel.findOne({ _id: new ObjectId(id) }).populate(this.populateOptions);
                resolve(binStockRecordToBinStockEntity(binStockRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async lastCreatedBinStock(): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockRecord = await BinStockModel.findOne().sort({ createdAt: -1 }).populate(this.populateOptions);
                resolve(binStockRecordToBinStockEntity(binStockRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByBinId(binId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockRecords = await BinStockModel.find({ bin: new ObjectId(binId) }).populate(this.populateOptions);
                resolve(binStocksRecordsToBinStocksEntities(binStockRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseBinAndProduct(warehouseBinId: string, productId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockRecords = await BinStockModel.find({ bin: new ObjectId(warehouseBinId), product: new ObjectId(productId) }).populate(this.populateOptions);
                resolve(binStocksRecordsToBinStocksEntities(binStockRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseBinAndProductAndVariant(warehouseBinId: string, productId: string, variantId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockRecords = await BinStockModel.find({
                    bin: new ObjectId(warehouseBinId),
                    product: new ObjectId(productId),
                    variant: new ObjectId(variantId),
                }).populate(this.populateOptions);
                resolve(binStocksRecordsToBinStocksEntities(binStockRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseBins(warehouseBinIds: string[]): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockRecords = await BinStockModel.find({
                    bin: { $in: warehouseBinIds.map((id: string) => new ObjectId(id)) }
                }).populate(this.populateOptions);
                resolve(binStocksRecordsToBinStocksEntities(binStockRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByWarehouseBinsAndProductAndVariant(warehouseBinIds: string[], productId: string, variantId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                let binStockRecords = await BinStockModel.find({
                    bin: { $in: warehouseBinIds.map((id: string) => new ObjectId(id)) },
                    product: new ObjectId(productId),
                    variant: new ObjectId(variantId)
                }).populate(this.populateOptions);
                resolve(binStocksRecordsToBinStocksEntities(binStockRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStocksByInventoryId(inventoryId: string): Promise<BinStock[]> {
        return new Promise<BinStock[]>(async (resolve, reject) => {
            try {
                // Sort ascending by expiryDate for FEFO — nulls last
                let binStockRecords = await BinStockModel
                    .find({ inventory: new ObjectId(inventoryId) })
                    .sort({ expiryDate: 1 })
                    .populate(this.populateOptions);
                resolve(binStocksRecordsToBinStocksEntities(binStockRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async binStockByBinAndBatch(binId: string, inventoryId: string, batchNumber: string): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockRecord = await BinStockModel.findOne({
                    bin: new ObjectId(binId),
                    inventory: new ObjectId(inventoryId),
                    batchNumber: batchNumber
                }).populate(this.populateOptions);
                resolve(binStockRecordToBinStockEntity(binStockRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async incrementBinStockQty(id: string, delta: number): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                await BinStockModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: { qtyOnHand: delta },
                        $set: { lastCountedAt: new Date() }
                    }
                );
                resolve(await this.binStockById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async decrementBinStockQty(id: string, delta: number): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                await BinStockModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: { qtyOnHand: -delta },
                        $set: { lastCountedAt: new Date() }
                    }
                );
                resolve(await this.binStockById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateBinStockById(binId: string, binStock: BinStock): Promise<BinStock> {
        return new Promise<BinStock>(async (resolve, reject) => {
            try {
                let binStockRecord = await BinStockModel.findOneAndUpdate({ _id: new ObjectId(binId) }, binStock);
                resolve(binStockRecordToBinStockEntity(binStockRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteById(binId: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let binStockRecord = await BinStockModel.deleteOne({ _id: new ObjectId(binId) });
                resolve(binStockRecord.acknowledged);
            } catch (error) {
                reject(error);
            }
        });
    }
}