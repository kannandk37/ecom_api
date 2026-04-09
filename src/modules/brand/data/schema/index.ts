import { model, Schema } from "mongoose";

const BrandSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true, index: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'categories', required: true, index: true },
    image: { type: String }
}, {
    timestamps: true
});

export const Brand = model('brands', BrandSchema);