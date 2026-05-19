import { model, Schema } from "mongoose";

const WarehouseBinSchema = new Schema({
    warehouse: { type: Schema.Types.ObjectId, ref: 'warehouses', required: true, index: true },
    binCode: { type: String, required: true, unique: true, index: true },
    aisle: { type: String, required: true },
    rack: { type: String, required: true },
    level: { type: String, required: true },
    position: { type: String },
    maxUnits: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    minThreshold: { type: Number, required: true, default: 20 },
    currentStock: { type: Number, required: true, default: 0 },
    isOccupied: { type: Boolean, required: true, default: false }
}, {
    timestamps: true
});

export const WarehouseBinModel = model('warehousebins', WarehouseBinSchema);