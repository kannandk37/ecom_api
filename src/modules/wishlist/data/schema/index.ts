import { model, Schema } from "mongoose";

const WishlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true, index: true },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', default: null }
}, {
    timestamps: true
});

export const WishlistModel = model('wishlists', WishlistSchema);
