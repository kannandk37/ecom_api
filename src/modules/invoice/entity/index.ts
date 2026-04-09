export enum InvoiceStatus {
    PAID = 'paid',
    PARTIALLY_PAID = 'partially paid',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected'
}

export class Invoice {
    id?: string;
    invoiceItemIds?: string[];
    totalAmount?: number;
    status?: InvoiceStatus;
    createdAt?: Date;
}