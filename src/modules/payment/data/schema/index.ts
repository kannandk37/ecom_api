import { model, Schema } from "mongoose";
import { PaymentMethod, PaymentStatus } from "../../entity";

const PaymentSchema = new Schema({
    gatewayOrderId: { type: String, index: true }, // For reconciliation with payment gateway
    referenceId: { type: String, index: true },
    status: { type: String, enum: PaymentStatus, default: PaymentStatus.PENDING, index: true },
    paidAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: PaymentMethod, index: true },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'order_items' }],
}, { timestamps: true });

export const PaymentModel = model('payments', PaymentSchema);