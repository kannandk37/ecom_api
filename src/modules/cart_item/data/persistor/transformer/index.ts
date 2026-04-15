import { variantRecordToVariantEntity } from "../../../../variant/data/persistor/transformer";
import { productRecordToProductEntity } from "../../../../product/data/persistor/transformer";
import { CartItem } from "../../../entity";
import { ObjectId } from "mongodb";

export function cartItemRecordToCartItemEntity(cartRecord: any): CartItem {
    let cart = new CartItem();

    if (cartRecord === null) {
        return cart = null;
    }

    if (cartRecord._id) {
        cart.id = cartRecord._id?.toString();
    }

    if (cartRecord.product) {
        cart.product = productRecordToProductEntity(cartRecord.product);
    }

    if (cartRecord.variant) {
        cart.variant = variantRecordToVariantEntity(cartRecord.variant);
    }

    return cart;
}

export function cartItemEntityToCartItemRecord(cart: CartItem): object {
    let record: any = {};

    if (cart === null) {
        return record = null;
    }

    if (cart.id) {
        record._id = new ObjectId(cart.id);
    }

    if (cart.product?.id) {
        record.product = new ObjectId(cart.product.id);
    }

    if (cart.variant?.id) {
        record.variant = new ObjectId(cart.variant.id);
    }

    return record;
}

export function cartItemsRecordsToCartItemsEntities(cartRecords: any[]): CartItem[] {
    if (!cartRecords || cartRecords.length === 0) {
        return [];
    }
    return cartRecords.map((record) => cartItemRecordToCartItemEntity(record));
}

export function cartItemsEntitiesToCartItemsRecords(carts: CartItem[]): object[] {
    if (!carts || carts.length === 0) {
        return [];
    }
    return carts.map((cart) => cartItemEntityToCartItemRecord(cart));
}