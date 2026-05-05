import { model, Schema } from "mongoose";

const WishlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true, unique: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true, index: true, unique: true },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', default: null, unique: true }
}, {
    timestamps: true
});

export const WishlistModel = model('wishlists', WishlistSchema);
