import { model, Schema } from "mongoose";
import { AddressType } from "../../entity";

const AddressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true }, // Index added for fast lookup of a user's address list
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    pincode: { type: String, required: true, index: true },
    country: { type: String, default: 'India' },
    isActive: { type: Boolean, default: true, index: true }, // Useful for filtering out old addresses in the UI
    type: { type: String, enum: AddressType, default: 'home' }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

export const AddressModel = model('addresses', AddressSchema);