import { variantRecordToVariantEntity } from "../../../../variant/data/persistor/transformer";
import { productRecordToProductEntity } from "../../../../product/data/persistor/transformer";
import { CartItem } from "../../../entity";
import { ObjectId } from "mongodb";

export function cartItemRecordToCartItemEntity(cartItemRecord: any): CartItem {
    let cartItem = new CartItem();

    if (cartItemRecord === null) {
        return cartItem = null;
    }

    if (cartItemRecord._id) {
        cartItem.id = cartItemRecord._id?.toString();
    }

    if (cartItemRecord.product) {
        cartItem.product = productRecordToProductEntity(cartItemRecord.product);
    }

    if (cartItemRecord.variant) {
        cartItem.variant = variantRecordToVariantEntity(cartItemRecord.variant);
    }

    if (cartItemRecord.quantity) {
        cartItem.quantity = cartItemRecord.quantity as number;
    }

    return cartItem;
}

export function cartItemEntityToCartItemRecord(cartItem: CartItem): any {
    let record: any = {};

    if (cartItem === null) {
        return record = null;
    }

    if (cartItem.id) {
        record._id = new ObjectId(cartItem.id);
    }

    if (cartItem.product?.id) {
        record.product = new ObjectId(cartItem.product.id);
    }

    if (cartItem.variant?.id) {
        record.variant = new ObjectId(cartItem.variant.id);
    }

    if (cartItem.quantity) {
        record.quantity = cartItem.quantity;
    }

    return record;
}

export function cartItemsRecordsToCartItemsEntities(cartItemRecords: any[]): CartItem[] {
    if (!cartItemRecords || cartItemRecords.length === 0) {
        return [];
    }
    return cartItemRecords.map((record) => cartItemRecordToCartItemEntity(record));
}

export function cartItemsEntitiesToCartItemsRecords(cartItems: CartItem[]): any[] {
    if (!cartItems || cartItems.length === 0) {
        return [];
    }
    return cartItems.map((cartItem) => cartItemEntityToCartItemRecord(cartItem));
}