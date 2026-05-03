// business/index.ts
import { StockLedgerPersistor } from "../data/persistor";
import { StockLedger } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";

export class StockLedgerManagement {

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
}