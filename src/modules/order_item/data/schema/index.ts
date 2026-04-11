import { model, Schema } from "mongoose";
import { PaymentStatus } from "../../../payment/entity";

const OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    deliveredOn: { type: Date },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', index: true },
    quantity: { type: Number, required: true },
    paymentStatus: { type: String, enum: PaymentStatus, default: PaymentStatus.PENDING, index: true },
    deliveryStatus: { type: String, enum: ['pending', 'shipped', 'delivered'], index: true }, //TODO: need to create delivery module then change status
    trackingNumber: { type: String }
}, { timestamps: true });

export const OrderItemModel = model('order_items', OrderItemSchema);