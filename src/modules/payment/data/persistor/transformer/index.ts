import { orderItemEntitiesToOrderItemRecords, orderItemRecordsToOrderItemEntities } from "../../../../order_item/data/persistor/transformer";
import { Payment, PaymentMethod, PaymentStatus } from "../../../entity";
import { ObjectId } from "mongodb";

export function paymentRecordToPaymentEntity(paymentRecord: any): Payment {
    let payment = new Payment();

    if (paymentRecord === null) {
        return payment = null;
    }

    if (paymentRecord._id) {
        payment.id = paymentRecord._id?.toString();
    }

    if (paymentRecord.gatewayOrderId) {
        payment.gatewayOrderId = paymentRecord.gatewayOrderId;
    }

    if (paymentRecord.referenceId) {
        payment.referenceId = paymentRecord.referenceId;
    }

    if (paymentRecord.status) {
        payment.status = paymentRecord.status as PaymentStatus;
    }

    if (paymentRecord.paidAmount !== undefined) {
        payment.paidAmount = paymentRecord.paidAmount;
    }

    if (paymentRecord.paymentMethod) {
        payment.paymentMethod = paymentRecord.paymentMethod as PaymentMethod;
    }

    if (paymentRecord.orderItems && paymentRecord.orderItems.length > 0) {
        payment.orderItems = orderItemRecordsToOrderItemEntities(paymentRecord.orderItems);
    }

    return payment;
}

export function paymentEntityToPaymentRecord(payment: Payment): object {
    let record: any = {};

    if (payment === null) {
        return record = null;
    }

    if (payment.id) {
        record._id = new ObjectId(payment.id);
    }

    if (payment.gatewayOrderId) {
        record.gatewayOrderId = payment.gatewayOrderId;
    }

    if (payment.referenceId) {
        record.referenceId = payment.referenceId;
    }

    if (payment.status) {
        record.status = payment.status;
    }

    if (payment.paidAmount !== undefined) {
        record.paidAmount = payment.paidAmount;
    }

    if (payment.paymentMethod) {
        record.paymentMethod = payment.paymentMethod;
    }

    if (payment.orderItems && payment.orderItems.length > 0) {
        record.orderItems = payment.orderItems.map((item) => new ObjectId(item.id));
    }

    return record;
}

export function paymentRecordsToPaymentEntities(paymentRecords: any[]): Payment[] {
    if (!paymentRecords || paymentRecords.length === 0) {
        return [];
    }
    return paymentRecords.map((record) => paymentRecordToPaymentEntity(record));
}

export function paymentEntitiesToPaymentRecords(payments: Payment[]): object[] {
    if (!payments || payments.length === 0) {
        return [];
    }
    return payments.map((payment) => paymentEntityToPaymentRecord(payment));
}