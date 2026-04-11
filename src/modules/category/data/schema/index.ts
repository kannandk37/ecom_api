import { model, Schema } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true, index: true },
    description: { type: String },
    subCategory: { type: Schema.Types.ObjectId, ref: 'categories', index: true },
    image: { type: String }
}, {
    timestamps: true
});

export const CategoryModel = model('categories', CategorySchema);