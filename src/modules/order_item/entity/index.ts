import { OrderStatus } from "../../order/entity";
import { PaymentStatus } from "../../payment/entity";
import { Product } from "../../product/entity";

export class OrderItem {
    id?: string;
    product?: Product;
    price?: number;
    discount?: number;
    status?: OrderStatus;
    deliveredOn?: Date;
    // Added:
    variantId?: string; // Specifically identifies which size/grade was bought
    quantity?: number; // Mandatory to calculate total item price
    paymentStatus?: PaymentStatus; // To track if the item has been paid for
}