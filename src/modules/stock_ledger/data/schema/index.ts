import { model, Schema } from "mongoose";
import { MovementType, ReferenceType } from "../../entity";

const StockLedgerSchema = new Schema({
    inventory: { type: Schema.Types.ObjectId, ref: 'inventories', required: true, index: true },
    warehouse: { type: Schema.Types.ObjectId, ref: 'warehouses', index: true },
    bin: { type: Schema.Types.ObjectId, ref: 'warehousebins', default: null },
    binStock: { type: Schema.Types.ObjectId, ref: 'binstocks', default: null },
    product: { type: Schema.Types.ObjectId, ref: 'products', index: true },
    variant: { type: Schema.Types.ObjectId, ref: 'variants', index: true },
    movementType: {
        type: String,
        enum: MovementType,
        required: true,
    },
    quantityDelta: { type: Number, required: true },
    qtyBefore: { type: Number, required: true },
    qtyAfter: { type: Number, required: true },
    referenceType: {
        type: String,
        enum: ReferenceType,
    },
    referenceId: { type: String, default: null },
    notes: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: 'users' }
}, {
    timestamps: true
});

export const StockLedgerModel = model('stockledgers', StockLedgerSchema);