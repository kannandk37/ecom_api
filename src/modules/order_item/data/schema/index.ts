import { model, Schema } from "mongoose";
import { PaymentStatus } from "../../../payment/entity";

const OrderItemSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'orders', index: true },
    variantId: { type: Schema.Types.ObjectId, ref: 'variants', index: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    paymentStatus: { type: String, enum: PaymentStatus, default: 'unpaid', index: true },
    deliveryStatus: { type: String, enum: ['pending', 'shipped', 'delivered'], index: true }
}, { timestamps: true });

export const OrderItem = model('order_items', OrderItemSchema);