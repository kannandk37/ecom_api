import { model, Schema } from "mongoose";

const EmailAccountSchema = new Schema({
    email: { type: String, unique: true, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    refreshToken: { type: String, index: true },
    accessToken: { type: String }
}, {
    timestamps: true
});

export const EmailAccountModel = model('emailAccounts', EmailAccountSchema);