import { model, Schema } from "mongoose";

const ProfileSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    mobile: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'roles' },
    profilePic: { type: String },
    isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const Profile = model('profiles', ProfileSchema);