import { invoiceRecordToInvoiceEntity } from "../../../../invoice/data/persistor/transformer";
import { PaymentStatus } from "../../../../payment/entity";
import { InvoiceItem } from "../../../entity";
import { ObjectId } from "mongodb";
import { orderItemRecordToOrderItemEntity } from "../../../../order_item/data/persistor/transformer";
import { paymentRecordToPaymentEntity } from "../../../../payment/data/persistor/transformer";

export function invoiceItemRecordToInvoiceItemEntity(invoiceItemRecord: any): InvoiceItem {
    let invoiceItem = new InvoiceItem();

    if (invoiceItemRecord === null) {
        return invoiceItem = null;
    }

    if (invoiceItemRecord._id) {
        invoiceItem.id = invoiceItemRecord._id?.toString();
    }

    if (invoiceItemRecord.invoice) {
        invoiceItem.invoice = invoiceRecordToInvoiceEntity(invoiceItemRecord.invoice);
    }

    if (invoiceItemRecord.orderItem) {
        invoiceItem.orderItem = orderItemRecordToOrderItemEntity(invoiceItemRecord.orderItem);
    }

    if (invoiceItemRecord.amount !== undefined) {
        invoiceItem.amount = invoiceItemRecord.amount;
    }

    if (invoiceItemRecord.payment) {
        invoiceItem.payment = paymentRecordToPaymentEntity(invoiceItemRecord.payment);
    }

    if (invoiceItemRecord.paidOn) {
        invoiceItem.paidOn = invoiceItemRecord.paidOn;
    }

    if (invoiceItemRecord.status) {
        invoiceItem.status = invoiceItemRecord.status as PaymentStatus;
    }

    return invoiceItem;
}

export function invoiceItemEntityToInvoiceItemRecord(invoiceItem: InvoiceItem): object {
    let record: any = {};

    if (invoiceItem === null) {
        return record = null;
    }

    if (invoiceItem.id) {
        record._id = new ObjectId(invoiceItem.id);
    }

    if (invoiceItem.invoice?.id) {
        record.invoice = new ObjectId(invoiceItem.invoice.id);
    }

    if (invoiceItem.orderItem?.id) {
        record.orderItem = new ObjectId(invoiceItem.orderItem.id);
    }

    if (invoiceItem.amount !== undefined) {
        record.amount = invoiceItem.amount;
    }

    if (invoiceItem.payment?.id) {
        record.payment = new ObjectId(invoiceItem.payment.id);
    }

    if (invoiceItem.paidOn) {
        record.paidOn = invoiceItem.paidOn;
    }

    if (invoiceItem.status) {
        record.status = invoiceItem.status;
    }

    return record;
}

export function invoiceItemRecordsToInvoiceItemEntities(invoiceItemRecords: any[]): InvoiceItem[] {
    if (!invoiceItemRecords || invoiceItemRecords.length === 0) {
        return [];
    }
    return invoiceItemRecords.map((record) => invoiceItemRecordToInvoiceItemEntity(record));
}

export function invoiceItemEntitiesToInvoiceItemRecords(invoiceItems: InvoiceItem[]): object[] {
    if (!invoiceItems || invoiceItems.length === 0) {
        return [];
    }
    return invoiceItems.map((invoiceItem) => invoiceItemEntityToInvoiceItemRecord(invoiceItem));
}