import { invoiceRawDatumToInvoiceEntity } from "../../../invoice/router/transformer";
import { orderItemRawDatumToOrderItemEntity } from "../../../order_item/router/transformer";
import { paymentRawDatumToPaymentEntity } from "../../../payment/router/transformer";
import { InvoiceItem } from "../../entity";

export function invoiceItemRawDatumToInvoiceItemEntity(raw: any): InvoiceItem {
    let invoiceItem = new InvoiceItem();

    if (raw === null) {
        return invoiceItem = null;
    }

    if (raw.id) {
        invoiceItem.id = raw.id;
    }

    if (raw.invoice) {
        invoiceItem.invoice = invoiceRawDatumToInvoiceEntity(raw.invoice);
    }

    if (raw.orderItem) {
        invoiceItem.orderItem = orderItemRawDatumToOrderItemEntity(raw.orderItem);
    }

    if (raw.amount) {
        invoiceItem.amount = raw.amount;
    }

    if (raw.payment) {
        invoiceItem.payment = paymentRawDatumToPaymentEntity(raw.payment);
    }

    if (raw.paidOn) {
        invoiceItem.paidOn = new Date(raw.paidOn);
    }

    if (raw.status) {
        invoiceItem.status = raw.status;
    }

    return invoiceItem;
}

export function invoiceItemsRawDataToInvoiceItemsEntities(raws: any[]): InvoiceItem[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(invoiceItemRawDatumToInvoiceItemEntity);
}