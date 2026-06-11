import { InvoiceItem } from "../../entity";
import { InvoiceItemModel } from "../schema";
import { invoiceItemEntityToInvoiceItemRecord, invoiceItemRecordToInvoiceItemEntity, invoiceItemsRecordsToInvoiceItemsEntities } from "./transformer";
import { ObjectId } from 'mongodb';

export class InvoiceItemPersistor {

    async createInvoiceItem(invoiceItem: InvoiceItem): Promise<InvoiceItem> {
        return new Promise<InvoiceItem>(async (resolve, reject) => {
            try {
                let invoiceItemData = invoiceItemEntityToInvoiceItemRecord(invoiceItem);
                let invoiceItemRecord = await InvoiceItemModel.create(invoiceItemData);
                resolve(await invoiceItemRecordToInvoiceItemEntity(invoiceItemRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async invoiceItemsByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
        return new Promise<InvoiceItem[]>(async (resolve, reject) => {
            try {
                let invoiceItemRecord = await InvoiceItemModel.find({ invoice: new ObjectId(invoiceId) });
                resolve(await invoiceItemsRecordsToInvoiceItemsEntities(invoiceItemRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async updateInvoiceItemsByInvoiceItemIdsWithInvoice(invoiceItemIds: string[], invoiceId: string): Promise<InvoiceItem[]> {
        return new Promise<InvoiceItem[]>(async (resolve, reject) => {
            try {
                let invoiceItemRecords = await InvoiceItemModel.updateMany(
                    { _id: { $in: invoiceItemIds.map((id) => new ObjectId(id)) } },
                    { $set: { invoice: new ObjectId(invoiceId) } }
                ); resolve(await this.invoiceItemsByInvoiceItemIds(invoiceItemIds));
            } catch (error) {
                reject(error);
            }
        })
    }

    async invoiceItemsByInvoiceItemIds(invoiceItemIds: string[]): Promise<InvoiceItem[]> {
        return new Promise<InvoiceItem[]>(async (resolve, reject) => {
            try {
                const invoiceItemRecords = await InvoiceItemModel.find({
                    _id: { $in: invoiceItemIds.map((id) => new ObjectId(id)) }
                });
                resolve(await invoiceItemsRecordsToInvoiceItemsEntities(invoiceItemRecords));
            } catch (error) {
                reject(error);
            }
        })
    }
}