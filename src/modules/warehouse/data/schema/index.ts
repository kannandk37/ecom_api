import { model, Schema } from "mongoose";
import { CapacityUnit, WarehouseStatus, WarehouseType } from "../../entity";

const WarehouseSchema = new Schema({
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: WarehouseType, required: true, default: WarehouseType.OWN },
    status: { type: String, enum: WarehouseStatus, required: true, default: WarehouseStatus.ACTIVE },
    address: { type: Schema.Types.ObjectId, required: true, ref: 'addresss', index: true },
    totalCapacity: { type: Number },
    capacityUnit: { type: String, enum: CapacityUnit, required: true, default: CapacityUnit.UNITS },
    operator: { type: Schema.Types.ObjectId, ref: 'users', index: true },
}, {
    timestamps: true
});

export const WarehouseModel = model('warehouses', WarehouseSchema);