import { model, Schema } from "mongoose";
import { OrderStatus } from "../../entity";

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', index: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'orderItems', required: true }],
    billingAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
    deliveryAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
    totalDiscount: { type: Number, required: true },
    promocode: { type: String },
    invoice: { type: Schema.Types.ObjectId, ref: 'invoices', index: true },
    status: { type: String, enum: OrderStatus, default: OrderStatus.INORDER, index: true },
    totalPrice: { type: Number, required: true },
    snapShot: { type: Object, required: true } // Snapshotted
}, { timestamps: true });

export const OrderModel = model('orders', OrderSchema);