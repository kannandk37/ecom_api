import { addressRawDatumToAddressEntity } from "../../../address/router/transformer";
import { invoiceRawDatumToInvoiceEntity } from "../../../invoice/router/transformer";
import { orderItemsRawDataToOrderItemsEntities } from "../../../order_item/router/transformer";
import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { Order, OrderStatus } from "../../entity";

export function orderRawDatumToOrderEntity(raw: any): Order {
    let order = new Order();

    if (raw === null) {
        return order = null;
    }

    if (raw.id) {
        order.id = raw.id;
    }

    if (raw.user) {
        order.user = userRawDatumToUserEntity(raw.user);
    }

    if (raw.orderItems) {
        order.orderItems = orderItemsRawDataToOrderItemsEntities(raw.orderItems);
    }

    if (raw.billingAddress) {
        order.billingAddress = addressRawDatumToAddressEntity(raw.billingAddress);
    }

    if (raw.deliveryAddress) {
        order.deliveryAddress = addressRawDatumToAddressEntity(raw.deliveryAddress);
    }

    if (raw.totalPrice) {
        order.totalPrice = raw.totalPrice;
    }

    if (raw.totalDiscount) {
        order.totalDiscount = raw.totalDiscount;
    }

    if (raw.promocode) {
        order.promocode = raw.promocode;
    }

    if (raw.invoice) {
        order.invoice = invoiceRawDatumToInvoiceEntity(raw.invoice);
    }

    if (raw.status) {
        order.status = raw.status as OrderStatus;
    }

    if (raw.snapShot) {
        order.snapShot = raw.snapShot;
    }

    return order;
}

export function ordersRawDataToOrdersEntities(raws: any[]): Order[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(orderRawDatumToOrderEntity);
}