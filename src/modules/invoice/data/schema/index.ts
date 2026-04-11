import { model, Schema } from "mongoose";
import { InvoiceStatus } from "../../entity";

const InvoiceSchema = new Schema({
    invoiceItems: [{ type: Schema.Types.ObjectId, ref: 'invoiceItems', required: true }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: InvoiceStatus, default: 'pending' }
}, {
    timestamps: true
});

export const InvoiceModel = model('invoices', InvoiceSchema);