import { model, Schema } from "mongoose";

const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    cartItems: [{ type: Schema.Types.ObjectId, ref: 'cart_items', required: true, index: true }],
    appliedPromocode: { type: String },
    isActive: { type: Boolean }
}, {
    timestamps: true
});

export const CartModel = model('carts', CartSchema);