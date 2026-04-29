import { model, Schema } from "mongoose";
import { Label, Unit } from "../../entity";

const ProductSchema = new Schema({
    title: { type: String },
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true }, // SEO URLs
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'categories', index: true },
    brand: { type: Schema.Types.ObjectId, ref: 'brands', index: true },
    variants: [{ type: Schema.Types.ObjectId, ref: 'variants' }],
    price: { type: Number, required: true },
    weight: { type: String },
    unit: { type: String, enum: Unit },
    images: [{ type: String, required: true }],
    features: [{ type: String, required: true }],
    specs: [{ type: { label: { type: String, required: true, enum: Label }, value: { type: Schema.Types.Mixed, required: true } }, required: true }],
    averageRating: { type: Number, default: 0, index: true }, // For "Top Rated" sorting
}, { timestamps: true });

export const ProductModel = model('products', ProductSchema);