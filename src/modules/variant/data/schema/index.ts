import { model, Schema } from "mongoose";
import { VariantGrade, VariantType } from "../../entity";

const VariantSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products', index: true },
    sku: { type: String, unique: true, index: true }, // Inventory lookup
    type: { type: String, enum: VariantType },
    grade: { type: String, enum: VariantGrade },
    price: { type: Number, required: true, index: true }, // For price range filters
    stockQuantity: { type: Number, default: 0 },
    weight: { type: Number },
    unit: { type: String }
}, { timestamps: true });

export const Variant = model('variants', VariantSchema);