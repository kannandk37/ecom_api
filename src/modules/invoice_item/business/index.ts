import { InvoiceItemPersistor } from "../data/persistor";
import { InvoiceItem } from "../entity";

export class InvoiceItemManagement {
    async createInvoiceItem(invoiceItem: InvoiceItem): Promise<InvoiceItem> {
        return new Promise<InvoiceItem>(async (resolve, reject) => {
            try {
                let invoiceItemPersistor = new InvoiceItemPersistor();
                resolve(await invoiceItemPersistor.createInvoiceItem(invoiceItem));
            } catch (error) {
                reject(error);
            }
        })
    }

    async updateInvoiceItemsByInvoiceItemIdsWithInvoice(invoiceItemIds: string[], invoiceId: string): Promise<InvoiceItem[]> {
        return new Promise<InvoiceItem[]>(async (resolve, reject) => {
            try {
                let invoiceItemPersistor = new InvoiceItemPersistor();
                resolve(await invoiceItemPersistor.updateInvoiceItemsByInvoiceItemIdsWithInvoice(invoiceItemIds, invoiceId));
            } catch (error) {
                reject(error);
            }
        })
    }

    async invoiceItemsByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
        return new Promise<InvoiceItem[]>(async (resolve, reject) => {
            try {
                let invoiceItemPersistor = new InvoiceItemPersistor();
                resolve(await invoiceItemPersistor.invoiceItemsByInvoiceId(invoiceId));
            } catch (error) {
                reject(error);
            }
        })
    }
}