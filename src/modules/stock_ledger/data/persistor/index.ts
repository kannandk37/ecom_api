import { StockLedger } from "../../entity";
import { StockLedgerModel } from "../schema";
import { WarehouseModel } from "../../../warehouse/data/schema";
import { WarehouseBinModel } from "../../../warehouse_bin/data/schema";
import { InventoryModel } from "../../../inventory/data/schema";
import { BinStockModel } from "../../../bin_stock/data/schema";
import {
    stockLedgerEntityToStockLedgerRecord,
    stockLedgerRecordToStockLedgerEntity,
    stockLedgersRecordsToStockLedgersEntities
} from "./transformer";
import { ObjectId } from "mongodb";

export class StockLedgerPersistor {

    private populateOptions = [
        { path: 'inventory', model: InventoryModel },
        { path: 'warehouse', model: WarehouseModel },
        { path: 'bin', model: WarehouseBinModel },
        { path: 'binStock', model: BinStockModel },
        { path: 'product' },
        { path: 'variant' }
    ];

    async createStockLedger(stockLedger: StockLedger): Promise<StockLedger> {
        return new Promise<StockLedger>(async (resolve, reject) => {
            try {
                let stockLedgerData = stockLedgerEntityToStockLedgerRecord(stockLedger);
                let stockLedgerRecord = await StockLedgerModel.create(stockLedgerData);
                resolve(await this.stockLedgerById(stockLedgerRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async stockLedgerById(id: string): Promise<StockLedger> {
        return new Promise<StockLedger>(async (resolve, reject) => {
            try {
                let stockLedgerRecord = await StockLedgerModel.findOne({ _id: new ObjectId(id) }).populate(this.populateOptions);
                resolve(stockLedgerRecordToStockLedgerEntity(stockLedgerRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async stockLedgersByInventoryId(inventoryId: string): Promise<StockLedger[]> {
        return new Promise<StockLedger[]>(async (resolve, reject) => {
            try {
                let stockLedgerRecords = await StockLedgerModel
                    .find({ inventory: new ObjectId(inventoryId) })
                    .sort({ createdAt: -1 })
                    .populate(this.populateOptions);
                resolve(stockLedgersRecordsToStockLedgersEntities(stockLedgerRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async stockLedgersByReferenceId(referenceId: string): Promise<StockLedger[]> {
        return new Promise<StockLedger[]>(async (resolve, reject) => {
            try {
                let stockLedgerRecords = await StockLedgerModel
                    .find({ referenceId: referenceId })
                    .sort({ createdAt: -1 })
                    .populate(this.populateOptions);
                resolve(stockLedgersRecordsToStockLedgersEntities(stockLedgerRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    // Used in Flow 9 — finds the physical dispatch ledger (PICK with bin assigned) for an order
    async dispatchLedgerByOrderId(orderId: string): Promise<StockLedger> {
        return new Promise<StockLedger>(async (resolve, reject) => {
            try {
                let stockLedgerRecord = await StockLedgerModel.findOne({
                    referenceId: orderId,
                    movementType: 'pick',
                    bin: { $ne: null }   // bin is null at commit stage — only dispatch has a bin
                }).populate(this.populateOptions);
                resolve(stockLedgerRecordToStockLedgerEntity(stockLedgerRecord));
            } catch (error) {
                reject(error);
            }
        });
    }
}