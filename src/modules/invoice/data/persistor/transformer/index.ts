import { invoiceItemRecordsToInvoiceItemEntities } from "../../../../invoice_item/data/persistor/transformer";
import { Invoice, InvoiceStatus } from "../../../entity";
import { ObjectId } from "mongodb";

export function invoiceRecordToInvoiceEntity(invoiceRecord: any): Invoice {
    let invoice = new Invoice();

    if (invoiceRecord === null) {
        return invoice = null;
    }

    if (invoiceRecord._id) {
        invoice.id = invoiceRecord._id?.toString();
    }

    if (invoiceRecord.invoiceItemIds && invoiceRecord.invoiceItemIds.length > 0) {
        invoice.invoiceItems = invoiceItemRecordsToInvoiceItemEntities(invoiceRecord.invoiceItemIds);
    }

    if (invoiceRecord.totalAmount !== undefined) {
        invoice.totalAmount = invoiceRecord.totalAmount;
    }

    if (invoiceRecord.status) {
        invoice.status = invoiceRecord.status as InvoiceStatus;
    }

    if (invoiceRecord.createdAt) {
        invoice.createdAt = invoiceRecord.createdAt;
    }

    return invoice;
}

export function invoiceEntityToInvoiceRecord(invoice: Invoice): object {
    let record: any = {};

    if (invoice === null) {
        return record = null;
    }

    if (invoice.id) {
        record._id = new ObjectId(invoice.id);
    }

    if (invoice.invoiceItems && invoice.invoiceItems.length > 0) {
        record.invoiceItems = invoice.invoiceItems.map((item) => new ObjectId(item.id));
    }

    if (invoice.totalAmount !== undefined) {
        record.totalAmount = invoice.totalAmount;
    }

    if (invoice.status) {
        record.status = invoice.status;
    }

    if (invoice.createdAt) {
        record.createdAt = invoice.createdAt;
    }

    return record;
}

export function invoiceRecordsToInvoiceEntities(invoiceRecords: any[]): Invoice[] {
    if (!invoiceRecords || invoiceRecords.length === 0) {
        return [];
    }
    return invoiceRecords.map((record) => invoiceRecordToInvoiceEntity(record));
}

export function invoiceEntitiesToInvoiceRecords(invoices: Invoice[]): object[] {
    if (!invoices || invoices.length === 0) {
        return [];
    }
    return invoices.map((invoice) => invoiceEntityToInvoiceRecord(invoice));
}