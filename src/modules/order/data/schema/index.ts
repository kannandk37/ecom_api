import { model, Schema } from "mongoose";
import { OrderStatus } from "../../entity";

const OrderSchema = new Schema({
    cid: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'users', index: true },
    profile: { type: Schema.Types.ObjectId, ref: 'profiles' },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'orderItems', required: true }],
    billingAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
    deliveryAddress: { type: Schema.Types.ObjectId, ref: 'addresses', required: true },
    totalDiscount: { type: Number, default: 0 },
    promocode: { type: String },
    invoice: { type: Schema.Types.ObjectId, ref: 'invoices', index: true },
    status: { type: String, enum: OrderStatus, default: OrderStatus.INORDER, index: true },
    totalPrice: { type: Number, default: 0, required: true },
    finalAmount: { type: Number, default: 0, required: true },
    snapShot: { type: Object }
}, { timestamps: true });

export const OrderModel = model('orders', OrderSchema);