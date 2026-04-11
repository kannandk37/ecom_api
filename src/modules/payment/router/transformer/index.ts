import { orderItemsRawDataToOrderItemsEntities } from "../../../order_item/router/transformer";
import { Payment, PaymentMethod } from "../../entity";

export function paymentRawDatumToPaymentEntity(raw: any): Payment {
    let payment = new Payment();

    if (raw === null) {
        return payment = null;
    }

    if (raw.id) {
        payment.id = raw.id;
    }

    if (raw.gatewayOrderId) {
        payment.gatewayOrderId = raw.gatewayOrderId;
    }

    if (raw.referenceId) {
        payment.referenceId = raw.referenceId;
    }

    if (raw.status) {
        payment.status = raw.status;
    }

    if (raw.paidAmount) {
        payment.paidAmount = raw.paidAmount;
    }

    if (raw.paymentMethod) {
        payment.paymentMethod = raw.paymentMethod as PaymentMethod;
    }

    if (raw.orderItems) {
        payment.orderItems = orderItemsRawDataToOrderItemsEntities(raw.orderItems);
    }

    return payment;
}

export function paymentsRawDataToPaymentsEntities(raws: any[]): Payment[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(paymentRawDatumToPaymentEntity);
}