import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    roles: [{ type: Schema.Types.ObjectId, ref: 'roles', index: true }],
}, {
    timestamps: true
});

export const UserModel = model("users", UserSchema);