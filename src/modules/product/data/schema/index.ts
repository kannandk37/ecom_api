import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true }, // SEO URLs
    title: { type: String },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'categories', index: true },
    brand: { type: Schema.Types.ObjectId, ref: 'brands', index: true },
    variants: [{ type: Schema.Types.ObjectId, ref: 'variants' }],
    images: [String],
    features: [String],
    specs: [{ label: String, value: String }],
    averageRating: { type: Number, default: 0, index: true } // For "Top Rated" sorting
}, { timestamps: true });

export const Product = model('products', ProductSchema);