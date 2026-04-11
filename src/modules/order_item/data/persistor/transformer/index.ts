import { PaymentStatus } from "../../../../payment/entity";
import { OrderItem } from "../../../entity";
import { ObjectId } from "mongodb";
import { productRecordToProductEntity, productEntityToProductRecord } from "../../../../product/data/persistor/transformer";
import { variantRecordToVariantEntity, variantEntityToVariantRecord } from "../../../../variant/data/persistor/transformer";

export function orderItemRecordToOrderItemEntity(orderItemRecord: any): OrderItem {
    let orderItem = new OrderItem();

    if (orderItemRecord === null) {
        return orderItem = null;
    }

    if (orderItemRecord._id) {
        orderItem.id = orderItemRecord._id?.toString();
    }

    if (orderItemRecord.product) {
        orderItem.product = productRecordToProductEntity(orderItemRecord.product);
    }

    if (orderItemRecord.price !== undefined) {
        orderItem.price = orderItemRecord.price;
    }

    if (orderItemRecord.discount !== undefined) {
        orderItem.discount = orderItemRecord.discount;
    }

    if (orderItemRecord.deliveredOn) {
        orderItem.deliveredOn = orderItemRecord.deliveredOn;
    }

    if (orderItemRecord.variant) {
        orderItem.variant = variantRecordToVariantEntity(orderItemRecord.variant);
    }

    if (orderItemRecord.quantity !== undefined) {
        orderItem.quantity = orderItemRecord.quantity;
    }

    if (orderItemRecord.paymentStatus) {
        orderItem.paymentStatus = orderItemRecord.paymentStatus as PaymentStatus;
    }

    if (orderItemRecord.deliveryStatus) {
        orderItem.deliveryStatus = orderItemRecord.deliveryStatus;
    }

    if (orderItemRecord.trackingNumber) {
        orderItem.trackingNumber = orderItemRecord.trackingNumber;
    }

    return orderItem;
}

export function orderItemEntityToOrderItemRecord(orderItem: OrderItem): object {
    let record: any = {};

    if (orderItem === null) {
        return record = null;
    }

    if (orderItem.id) {
        record._id = new ObjectId(orderItem.id);
    }

    if (orderItem.product) {
        record.product = new ObjectId(orderItem.product.id);
    }

    if (orderItem.price !== undefined) {
        record.price = orderItem.price;
    }

    if (orderItem.discount !== undefined) {
        record.discount = orderItem.discount;
    }

    if (orderItem.deliveredOn) {
        record.deliveredOn = orderItem.deliveredOn;
    }

    if (orderItem.variant) {
        record.variant = new ObjectId(orderItem.variant.id);
    }

    if (orderItem.quantity !== undefined) {
        record.quantity = orderItem.quantity;
    }

    if (orderItem.paymentStatus) {
        record.paymentStatus = orderItem.paymentStatus;
    }

    if (orderItem.deliveryStatus) {
        record.deliveryStatus = orderItem.deliveryStatus;
    }

    if (orderItem.trackingNumber) {
        record.trackingNumber = orderItem.trackingNumber;
    }

    return record;
}

export function orderItemRecordsToOrderItemEntities(orderItemRecords: any[]): OrderItem[] {
    if (!orderItemRecords || orderItemRecords.length === 0) {
        return [];
    }
    return orderItemRecords.map((record) => orderItemRecordToOrderItemEntity(record));
}

export function orderItemEntitiesToOrderItemRecords(orderItems: OrderItem[]): object[] {
    if (!orderItems || orderItems.length === 0) {
        return [];
    }
    return orderItems.map((orderItem) => orderItemEntityToOrderItemRecord(orderItem));
}