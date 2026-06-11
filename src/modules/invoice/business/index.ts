import { InvoiceItemManagement } from "../../invoice_item/business";
import { InvoiceItem } from "../../invoice_item/entity";
import { PaymentManagement } from "../../payment/business";
import { Payment, PaymentStatus } from "../../payment/entity";
import { InvoicePersistor } from "../data/persistor";
import { Invoice, InvoiceStatus } from "../entity";

export class InvoiceManagement {
    async createInvoice(invoice: Invoice): Promise<Invoice> {
        return new Promise<Invoice>(async (resolve, reject) => {
            try {
                let invoicePeristor = new InvoicePersistor();
                let invoiceItemManagement = new InvoiceItemManagement();
                let invoiceItems: InvoiceItem[] = [];
                if (invoice.invoiceItems?.length > 0) {
                    for (const invoiceItem of invoice.invoiceItems) {
                        let paymentData = new Payment();
                        paymentData.status = PaymentStatus.PENDING;
                        let payment = await new PaymentManagement().createPayment(paymentData);
                        invoiceItem.payment = payment;
                        //TODO: need to check y added
                        // payment.orderItem
                        let persistorInvoiceItem = await invoiceItemManagement.createInvoiceItem(invoiceItem);
                        invoiceItems.push(persistorInvoiceItem);
                    }
                    invoice.status = InvoiceStatus.PENDING;
                    invoice.invoiceItems = invoiceItems;
                }
                let persistedInvoice = await invoicePeristor.createInvoice(invoice);
                await invoiceItemManagement.updateInvoiceItemsByInvoiceIdWithInvoice(invoiceItems.map((el: InvoiceItem) => el.id), persistedInvoice.id)
                resolve(await this.invoiceById(persistedInvoice.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async invoices(): Promise<Invoice[]> {
        return new Promise<Invoice[]>(async (resolve, reject) => {
            try {
                let invoicePeristor = new InvoicePersistor();
                resolve(await invoicePeristor.invoices());
            } catch (error) {
                reject(error);
            }
        });
    }

    async invoiceById(id: string): Promise<Invoice> {
        return new Promise<Invoice>(async (resolve, reject) => {
            try {
                let invoicePeristor = new InvoicePersistor();
                resolve(await invoicePeristor.invoiceById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async invoicesByIds(ids: string[]): Promise<Invoice[]> {
        return new Promise<Invoice[]>(async (resolve, reject) => {
            try {
                let invoicePeristor = new InvoicePersistor();
                resolve(await invoicePeristor.invoicesByIds(ids));
            } catch (error) {
                reject(error);
            }
        });
    }
}