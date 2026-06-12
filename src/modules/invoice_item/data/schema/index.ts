import { model, Schema } from "mongoose";
import { InvoiceStatus } from "../../../invoice/entity";

const InvoiceItemSchema = new Schema({
    ivoice: { type: Schema.Types.ObjectId, ref: 'invoices', index: true },
    orderItem: { type: Schema.Types.ObjectId, ref: 'orderItems', index: true },
    amount: { type: Number, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'payments', required: true, index: true },
    paidOn: { type: Date },
    status: { type: String, enum: InvoiceStatus, default: InvoiceStatus.PENDING }
}, {
    timestamps: true
});

export const InvoiceItemModel = model('invoiceItems', InvoiceItemSchema);