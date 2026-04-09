export enum OrderStatus {
    INORDER = 'inorder',
    ORDERED = 'ordered',
    PAID = 'paid',
    DELIVERED = 'delivered',
    PARTIALLY_DELIVERED = 'partially delivered',
    INTRANSIT = 'intransit',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected'
}

export class Order {
    id?: string;
    userId?: string;
    orderItemsIds?: string[];
    billingAddress?: object; // Snapshot of the address at time of purchase
    deliveryAddress?: object; // Snapshot of the address at time of purchase
    totalPrice?: number;
    totalDiscount?: number;
    promocode?: string;
    invoiceId?: string;
    status?: OrderStatus;
    // Added:
    trackingNumber?: string; // Required for logistics and customer updates
}