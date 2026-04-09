import { model, Schema } from "mongoose";
import { PaymentMethod } from "../../entity";

const PaymentSchema = new Schema({
    invoice: { type: Schema.Types.ObjectId, ref: 'invoices', index: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'order_items' }],
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: PaymentMethod, index: true },
    referenceId: { type: String, index: true }, // Bank or Receipt ID
    recordedBy: { type: Schema.Types.ObjectId, ref: 'users' } // Agent ID
}, { timestamps: true });

export const Payment = model('payments', PaymentSchema);