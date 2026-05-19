// business/index.ts
import { StockLedgerPersistor } from "../data/persistor";
import { StockLedger } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";

export class StockLedgerManagement {

    async createStockLedger(stockLedger: StockLedger): Promise<StockLedger> {
        return new Promise<StockLedger>(async (resolve, reject) => {
            try {
                let stockLedgerRecord = await new StockLedgerPersistor().createStockLedger(stockLedger);
                resolve(await this.stockLedgerById(stockLedgerRecord.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async createManyStockLedgers(stockLedgers: StockLedger[]): Promise<StockLedger[]> {
        return new Promise<StockLedger[]>(async (resolve, reject) => {
            try {
                let stockLedgerRecords = await new StockLedgerPersistor().createManyStockLedgers(stockLedgers);
                resolve(stockLedgerRecords);
            } catch (error) {
                reject(error);
            }
        });
    }

    async stockLedgerById(id: string): Promise<StockLedger> {
        return new Promise<StockLedger>(async (resolve, reject) => {
            try {
                let stockLedgerPersistor = new StockLedgerPersistor();
                let stockLedger = await stockLedgerPersistor.stockLedgerById(id);
                if (!stockLedger) {
                    return reject(new ApiError("Stock ledger entry not found", StatusCodes.NOT_FOUND));
                }
                resolve(stockLedger);
            } catch (error) {
                reject(error);
            }
        });
    }

    async stockLedgersByInventoryId(inventoryId: string): Promise<StockLedger[]> {
        return new Promise<StockLedger[]>(async (resolve, reject) => {
            try {
                let stockLedgerPersistor = new StockLedgerPersistor();
                resolve(await stockLedgerPersistor.stockLedgersByInventoryId(inventoryId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async stockLedgersByReferenceId(referenceId: string): Promise<StockLedger[]> {
        return new Promise<StockLedger[]>(async (resolve, reject) => {
            try {
                let stockLedgerPersistor = new StockLedgerPersistor();
                resolve(await stockLedgerPersistor.stockLedgersByReferenceId(referenceId));
            } catch (error) {
                reject(error);
            }
        });
    }

    // Used in Flow 9 — finds the physical dispatch ledger (PICK with bin assigned) for an order
    async dispatchLedgerByOrderId(orderId: string): Promise<StockLedger> {
        return new Promise<StockLedger>(async (resolve, reject) => {
            try {
                let stockLedger = await new StockLedgerPersistor().dispatchLedgerByOrderId(orderId);
                resolve(stockLedger);
            } catch (error) {
                reject(error);
            }
        });
    }
}