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

export class BinStockPersistor {

    private populateOptions = [
        { path: 'bin', model: WarehouseBinModel },
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
}