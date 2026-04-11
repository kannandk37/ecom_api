import { model, Schema } from "mongoose";

const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'orders', required: true, index: true }
}, {
    timestamps: true
});

export const CartModel = model('carts', CartSchema);