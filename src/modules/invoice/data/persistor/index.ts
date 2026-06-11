import { ObjectId } from "mongodb";
import { Invoice } from "../../entity";
import { invoiceEntityToInvoiceRecord, invoiceRecordToInvoiceEntity, invoicesRecordsToInvoicesEntities } from "./transformer";
import { InvoiceModel } from "../schema";
import { InvoiceItemModel } from "../../../invoice_item/data/schema";
import { PaymentModel } from "../../../payment/data/schema";

export class InvoicePersistor {
    async createInvoice(invoice: Invoice): Promise<Invoice> {
        return new Promise<Invoice>(async (resolve, reject) => {
            try {
                let invoiceData = invoiceEntityToInvoiceRecord(invoice);
                let invoiceRecord = await InvoiceModel.create(invoiceData);
                resolve(await invoiceRecordToInvoiceEntity(invoiceRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async invoices(): Promise<Invoice[]> {
        return new Promise<Invoice[]>(async (resolve, reject) => {
            try {
                let invoicesRecords = await InvoiceModel.find().populate([invoiceItemsPopulate()]);
                resolve(await invoicesRecordsToInvoicesEntities(invoicesRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async invoiceById(id: string): Promise<Invoice> {
        return new Promise<Invoice>(async (resolve, reject) => {
            try {
                let invoiceRecord = await InvoiceModel.findOne({ _id: new ObjectId(id) }).populate([invoiceItemsPopulate()]);
                resolve(await invoiceRecordToInvoiceEntity(invoiceRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async invoicesByIds(ids: string[]): Promise<Invoice[]> {
        return new Promise<Invoice[]>(async (resolve, reject) => {
            try {
                let invoiceRecords = await InvoiceModel.find({ _id: { $in: ids.map((id: string) => new ObjectId(id)) } }).populate([invoiceItemsPopulate()]);
                resolve(await invoicesRecordsToInvoicesEntities(invoiceRecords));
            } catch (error) {
                reject(error);
            }
        })
    }
}

export function invoiceItemsPopulate() {
    return {
        path: 'invoiceItems',
        model: InvoiceItemModel,
        populate: [{
            path: "payment",
            model: PaymentModel
        },
            // {
            //     path: "variant",
            //     model: VariantModel
            // }
        ]
    }
}