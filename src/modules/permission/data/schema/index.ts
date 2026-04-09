import { Schema, model } from 'mongoose';

const PermissionSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true }, // Fast lookup for middleware checks
    module: { type: String, index: true },
    action: { type: String, enum: ['create', 'read', 'update', 'delete', 'manage'] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Permission = model('permissions', PermissionSchema);