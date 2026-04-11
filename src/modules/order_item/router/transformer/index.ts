import { PaymentStatus } from "../../../payment/entity";
import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { OrderItem } from "../../entity";

export function orderItemRawDatumToOrderItemEntity(raw: any): OrderItem {
    let orderItem = new OrderItem();

    if (raw === null) {
        return orderItem = null;
    }

    if (raw.id) {
        orderItem.id = raw.id;
    }

    if (raw.product) {
        orderItem.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.price) {
        orderItem.price = raw.price;
    }

    if (raw.discount) {
        orderItem.discount = raw.discount;
    }

    if (raw.deliveredOn) {
        orderItem.deliveredOn = new Date(raw.deliveredOn);
    }

    if (raw.variant) {
        orderItem.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    if (raw.paymentStatus) {
        orderItem.paymentStatus = raw.paymentStatus as PaymentStatus;
    }

    if (raw.deliveryStatus) {
        orderItem.deliveryStatus = raw.deliveryStatus;
    }

    if (raw.trackingNumber) {
        orderItem.trackingNumber = raw.trackingNumber;
    }

    if (raw.quantity) {
        orderItem.quantity = raw.quantity;
    }


    return orderItem;
}

export function orderItemsRawDataToOrderItemsEntities(raws: any[]): OrderItem[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(orderItemRawDatumToOrderItemEntity);
}