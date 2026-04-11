import { model, Schema } from "mongoose";
import { RoleName } from "../../entity";

const RoleSchema = new Schema({
    name: { type: String, enum: RoleName, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'permissions' }],
    description: { type: String },
    isSystemRole: { type: Boolean, default: false }
}, { timestamps: true });

export const RoleModel = model('roles', RoleSchema);