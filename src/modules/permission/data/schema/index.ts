import { Schema, model } from 'mongoose';
import { PermissionActions, PermissionResources } from '../../entity';

const PermissionSchema = new Schema({
    description: { type: String, required: true },
    key: { type: String, unique: true, index: true },
    resource: { type: String, enum: PermissionResources, index: true },
    action: { type: String, enum: PermissionActions, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const PermissionModel = model('permissions', PermissionSchema);