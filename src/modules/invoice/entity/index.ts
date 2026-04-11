import { InvoiceItem } from "../../invoice_item/entity";

export enum InvoiceStatus {
    PAID = 'paid',
    PARTIALLY_PAID = 'partially paid',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected'
}

export class Invoice {
    id?: string;
    invoiceItems?: InvoiceItem[];
    totalAmount?: number;
    status?: InvoiceStatus;
    createdAt?: Date;
}