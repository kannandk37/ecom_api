import { userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { Order, OrderStatus } from "../../../entity";
import { ObjectId } from "mongodb";
import { orderItemsRecordsToOrderItemsEntities } from "../../../../order_item/data/persistor/transformer";
import { invoiceRecordToInvoiceEntity } from "../../../../invoice/data/persistor/transformer";
import { addressRecordToAddressEntity } from "../../../../address/data/persistor/transformer";
import { profileRecordToProfileEntity } from "../../../../profile/data/persistor/transformer";

export function orderRecordToOrderEntity(orderRecord: any): Order {
    let order = new Order();

    if (orderRecord === null) {
        return order = null;
    }

    if (orderRecord._id) {
        order.id = orderRecord._id?.toString();
    }

    if (orderRecord.cid) {
        order.cid = orderRecord.cid;
    }

    if (orderRecord.user) {
        order.user = userRecordToUserEntity(orderRecord.user);
    }

    if (orderRecord.profile) {
        order.profile = profileRecordToProfileEntity(orderRecord.profile);
    }

    if (orderRecord.orderItems && orderRecord.orderItems.length > 0) {
        order.orderItems = orderItemsRecordsToOrderItemsEntities(orderRecord.orderItems);
    }

    if (orderRecord.billingAddress) {
        order.billingAddress = addressRecordToAddressEntity(orderRecord.billingAddress);
    }

    if (orderRecord.deliveryAddress) {
        order.deliveryAddress = addressRecordToAddressEntity(orderRecord.deliveryAddress);
    }

    if (orderRecord.totalPrice !== undefined) {
        order.totalPrice = orderRecord.totalPrice;
    }

    if (orderRecord.totalTaxAmount !== undefined) {
        order.totalTaxAmount = orderRecord.totalTaxAmount;
    }

    if (orderRecord.finalAmount !== undefined) {
        order.finalAmount = orderRecord.finalAmount;
    }

    if (orderRecord.totalDiscount !== undefined) {
        order.totalDiscount = orderRecord.totalDiscount;
    }

    if (orderRecord.promocode) {
        order.promocode = orderRecord.promocode;
    }

    if (orderRecord.invoice) {
        order.invoice = invoiceRecordToInvoiceEntity(orderRecord.invoice);
    }

    if (orderRecord.status) {
        order.status = orderRecord.status as OrderStatus;
    }

    if (orderRecord.snapShot) {
        order.snapShot = orderRecord.snapShot;
    }

    return order;
}

export function orderEntityToOrderRecord(order: Order): object {
    let record: any = {};

    if (order === null) {
        return record = null;
    }

    if (order.id) {
        record._id = new ObjectId(order.id);
    }

    if (order.cid) {
        record.cid = order.cid;
    }

    if (order.user?.id) {
        record.user = new ObjectId(order.user.id);
    }

    if (order.profile?.id) {
        record.profile = new ObjectId(order.profile.id);
    }

    if (order.orderItems && order.orderItems.length > 0) {
        record.orderItems = order.orderItems.map((item) => new ObjectId(item.id));
    }

    if (order.billingAddress) {
        record.billingAddress = new ObjectId(order.billingAddress?.id);
    }

    if (order.deliveryAddress) {
        record.deliveryAddress = new ObjectId(order.deliveryAddress?.id);
    }

    if (order.totalPrice !== undefined) {
        record.totalPrice = order.totalPrice;
    }

    if (order.totalTaxAmount !== undefined) {
        record.totalTaxAmount = order.totalTaxAmount;
    }

    if (order.finalAmount !== undefined) {
        record.finalAmount = order.finalAmount;
    }

    if (order.totalDiscount !== undefined) {
        record.totalDiscount = order.totalDiscount;
    }

    if (order.promocode) {
        record.promocode = order.promocode;
    }

    if (order.invoice?.id) {
        record.invoice = new ObjectId(order.invoice.id);
    }

    if (order.status) {
        record.status = order.status;
    }

    if (order.snapShot) {
        record.snapShot = order.snapShot;
    }

    return record;
}

export function ordersRecordsToOrdersEntities(orderRecords: any[]): Order[] {
    if (!orderRecords || orderRecords.length === 0) {
        return [];
    }
    return orderRecords.map((record) => orderRecordToOrderEntity(record));
}

export function ordersEntitiesToOrdersRecords(orders: Order[]): object[] {
    if (!orders || orders.length === 0) {
        return [];
    }
    return orders.map((order) => orderEntityToOrderRecord(order));
}