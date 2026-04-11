import { model, Schema } from "mongoose";
import { PaymentStatus } from "../../../payment/entity";

const InvoiceItemSchema = new Schema({
    ivoice: { type: Schema.Types.ObjectId, ref: 'invoices', required: true, index: true },
    orderItem: { type: Schema.Types.ObjectId, ref: 'orderItems', required: true, index: true },
    amount: { type: Number, required: true },
    payment: { type: Schema.Types.ObjectId, ref: 'payments', required: true, index: true },
    paidOn: { type: Date, required: true },
    status: { type: String, enum: PaymentStatus, default: 'pending' }
}, {
    timestamps: true
});

export const InvoiceItemModel = model('invoiceItems', InvoiceItemSchema);