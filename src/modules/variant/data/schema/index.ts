import { model, Schema } from "mongoose";
import { VariantGrade, VariantType } from "../../entity";

const VariantSchema = new Schema({
    name: { type: String, required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', index: true },
    type: { type: String, enum: VariantType },
    grade: { type: String, enum: VariantGrade },
    price: { type: Number, required: true, index: true }, // For price range filters
    images: [{ type: String }],
    sku: { type: String, unique: true, index: true }, // Inventory lookup
    stockQuantity: { type: Number, default: 0 },
}, { timestamps: true });

export const VariantModel = model('variants', VariantSchema);