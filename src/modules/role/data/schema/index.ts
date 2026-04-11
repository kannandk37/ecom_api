import { model, Schema } from "mongoose";

const RoleSchema = new Schema({
    name: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'permissions' }],
    description: { type: String },
    isSystemRole: { type: Boolean, default: false }
}, { timestamps: true });

export const RoleModel = model('roles', RoleSchema);