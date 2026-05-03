import { model, Schema } from "mongoose";

const BinStockSchema = new Schema({
    bin: { type: Schema.Types.ObjectId, ref: 'warehousebins', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true, index: true },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', index: true },
    inventory: { type: Schema.Types.ObjectId, ref: 'inventories', required: true, index: true },
    qtyOnHand: { type: Number, default: 0 },
    batchNumber: { type: String, trim: true, index: true },
    expiryDate: { type: Date },
    lastCountedAt: { type: Date }
}, {
    timestamps: true
});

// Unique slot per bin + inventory + batch
BinStockSchema.index({ bin: 1, inventory: 1, batchNumber: 1 }, { unique: true });

export const BinStockModel = model('binstocks', BinStockSchema);