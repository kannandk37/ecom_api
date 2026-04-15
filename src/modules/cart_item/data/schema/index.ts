import { model, Schema } from "mongoose";

const CartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true, index: true },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', required: true, index: true },
    quantity: { type: Number, required: true }
}, {
    timestamps: true
});

export const CartItemModel = model('cart_items', CartItemSchema);