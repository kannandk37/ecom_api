import { model, Schema } from "mongoose";
import { AccountStatus } from "../../entity";

const UserAccountSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },
    status: { type: String, enum: AccountStatus, default: AccountStatus.PENDING },
    conformationCode: { type: String },
    resetConfirmationCode: { type: String },
    password: { type: String },
    passwordResetedOn: { type: Date }
}, {
    timestamps: true
});

export const UserAccountModel = model('userAccounts', UserAccountSchema);