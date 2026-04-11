import { model, Schema } from "mongoose";

export const ProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    mobile: { type: String, unique: true, required: true, index: true },
    role: { type: Schema.Types.ObjectId, ref: 'roles' },
    profilePic: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, required: true }
}, { timestamps: true });

export const ProfileModel = model('profiles', ProfileSchema);