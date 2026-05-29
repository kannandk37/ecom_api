import { model, Schema } from "mongoose";
import { Unit, VariantGrade, VariantType } from "../../entity";

const VariantSchema = new Schema({
    name: { type: String, required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', index: true },
    type: { type: String, enum: VariantType },
    grade: { type: String, enum: VariantGrade },
    price: { type: Number, required: true }, // For price range filters
    weight: { type: String },
    unit: { type: String, enum: Unit },
    images: [{ type: String }],
    sku: { type: String, index: true }, // Inventory lookup
}, { timestamps: true });

export const VariantModel = model('variants', VariantSchema);