import { model, Schema } from "mongoose";
import { InvoiceStatus } from "../../../invoice/entity";

const InvoiceItemSchema = new Schema({
    ivoice: { type: Schema.Types.ObjectId, ref: 'invoices', required: true, index: true },
    orderItem: { type: Schema.Types.ObjectId, ref: 'orderItems', required: true, index: true },
    amount: { type: Number, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'payments', required: true, index: true },
    paidOn: { type: Date, required: true },
    status: { type: String, enum: InvoiceStatus, default: InvoiceStatus.PENDING }
}, {
    timestamps: true
});

export const InvoiceItemModel = model('invoiceItems', InvoiceItemSchema);