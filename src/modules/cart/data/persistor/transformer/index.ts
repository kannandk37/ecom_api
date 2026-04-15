import { cartItemsRecordsToCartItemsEntities } from "../../../../cart_item/data/persistor/transformer";
import { userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { Cart } from "../../../entity";
import { ObjectId } from "mongodb";

export function cartRecordToCartEntity(cartRecord: any): Cart {
    let cart = new Cart();

    if (cartRecord === null) {
        return cart = null;
    }

    if (cartRecord._id) {
        cart.id = cartRecord._id?.toString();
    }

    if (cartRecord.user) {
        cart.user = userRecordToUserEntity(cartRecord.user);
    }

    if (cartRecord?.cartItems && cartRecord.cartItems?.length > 0) {
        cart.cartItems = cartItemsRecordsToCartItemsEntities(cartRecord.cartItems);
    }

    if (cartRecord.appliedPromocode) {
        cart.appliedPromocode = cartRecord.appliedPromocode;
    }

    if (cartRecord.isActive != undefined || cartRecord.isActive != null) {
        cart.isActive = cartRecord.isActive;
    }

    return cart;
}

export function cartEntityToCartRecord(cart: Cart): object {
    let record: any = {};

    if (cart === null) {
        return record = null;
    }

    if (cart.id) {
        record._id = new ObjectId(cart.id);
    }

    if (cart.user?.id) {
        record.user = new ObjectId(cart.user.id);
    }

    if (cart.cartItems && cart.cartItems.length > 0) {
        record.cartItems = cart.cartItems.map((item) => new ObjectId(item.id));
    }

    if (cart.appliedPromocode) {
        record.appliedPromocode = cart.appliedPromocode;
    }

    if (cart.isActive != undefined || cart.isActive != null) {
        record.isActive = cart.isActive;
    }

    return record;
}

export function cartRecordsToCartEntities(cartRecords: any[]): Cart[] {
    if (!cartRecords || cartRecords.length === 0) {
        return [];
    }
    return cartRecords.map((record) => cartRecordToCartEntity(record));
}

export function cartEntitiesToCartRecords(carts: Cart[]): object[] {
    if (!carts || carts.length === 0) {
        return [];
    }
    return carts.map((cart) => cartEntityToCartRecord(cart));
}