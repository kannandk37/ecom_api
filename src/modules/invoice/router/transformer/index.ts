import { invoiceItemsRawDataToInvoiceItemsEntities } from "../../../invoice_item/router/transformer";
import { Invoice } from "../../entity";

export function invoiceRawDatumToInvoiceEntity(raw: any): Invoice {
    let invoice = new Invoice();

    if (raw === null) {
        return invoice = null;
    }

    if (raw.id) {
        invoice.id = raw.id;
    }

    if (raw.invoiceItems) {
        invoice.invoiceItems = invoiceItemsRawDataToInvoiceItemsEntities(raw.invoiceItems);
    }

    if (raw.totalAmount) {
        invoice.totalAmount = raw.totalAmount;
    }

    if (raw.status) {
        invoice.status = raw.status;
    }

    if (raw.createdAt) {
        invoice.createdAt = new Date(raw.createdAt);
    }

    return invoice;
}

export function invoicesRawDataToInvoicesEntities(raws: any[]): Invoice[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(invoiceRawDatumToInvoiceEntity);
}