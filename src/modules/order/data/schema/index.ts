import { model, Schema } from "mongoose";
import { OrderStatus } from "../../entity";

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', index: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: OrderStatus,
        index: true
    },
    deliveryAddress: { type: Object, required: true } // Snapshotted
}, { timestamps: true });

export const Order = model('orders', OrderSchema);