import { Invoice } from "../../invoice/entity";
import { OrderItem } from "../../order_item/entity";
import { Payment, PaymentStatus } from "../../payment/entity";

export class InvoiceItem {
    id?: string;
    invoice?: Invoice;
    orderItem?: OrderItem;
    amount?: number;
    payment?: Payment;
    paidOn?: Date;
    status?: PaymentStatus;
}