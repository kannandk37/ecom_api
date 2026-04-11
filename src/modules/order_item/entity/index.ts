import { OrderStatus } from "../../order/entity";
import { PaymentStatus } from "../../payment/entity";
import { Product } from "../../product/entity";
import { Variant } from "../../variant/entity";

export class OrderItem {
    id?: string;
    product?: Product;
    price?: number;
    discount?: number;
    deliveredOn?: Date;
    variant?: Variant; // Specifically identifies which size/grade was bought
    quantity?: number; // Mandatory to calculate total item price
    paymentStatus?: PaymentStatus; // To track if the item has been paid for
    deliveryStatus?: 'pending' | 'shipped' | 'delivered'; //TODO: need to create delivery module then change status, To track delivery progress
    trackingNumber?: string; // Required for logistics and customer updates
}