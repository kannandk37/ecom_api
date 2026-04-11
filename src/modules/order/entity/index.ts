import { Address } from "../../address/entity";
import { Invoice } from "../../invoice/entity";
import { OrderItem } from "../../order_item/entity";
import { User } from "../../user/entity";

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
    user?: User;
    orderItems?: OrderItem[];
    billingAddress?: Address;
    deliveryAddress?: Address;
    totalPrice?: number;
    totalDiscount?: number;
    promocode?: string;
    invoice?: Invoice;
    status?: OrderStatus;
    snapShot?: object; // Snapshot of the order at time of purchase
}