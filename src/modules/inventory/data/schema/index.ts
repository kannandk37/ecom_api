import { model, Schema } from "mongoose";
import { ReorderStatus } from "../../entity";

const InventorySchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true, index: true },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', index: true },
    warehouse: { type: Schema.Types.ObjectId, ref: 'warehouses', required: true, index: true },
    qtyOnHand: { type: Number, default: 0 },
    qtyReserved: { type: Number, default: 0 },
    qtyCommitted: { type: Number, default: 0 },
    reorderPoint: { type: Number },
    reorderQty: { type: Number },
    reorderOrderedQty: { type: Number, default: null },
    maxStockLevel: { type: Number },
    reorderStatus: { type: String, enum: ReorderStatus, default: ReorderStatus.NONE },
    lastMovementAt: { type: Date }
}, {
    timestamps: true
});

// Unique combination of product + variant + warehouse
InventorySchema.index({ product: 1, variant: 1, warehouse: 1 }, { unique: true });

export const InventoryModel = model('inventories', InventorySchema);