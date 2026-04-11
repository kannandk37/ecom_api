import { orderEntityToOrderRecord, orderRecordToOrderEntity } from "../../../../order/data/persistor/transformer";
import { userEntityToUserRecord, userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
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

    if (cartRecord.order) {
        cart.order = orderRecordToOrderEntity(cartRecord.order);
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

    if (cart.user) {
        record.user = userEntityToUserRecord(cart.user);
    }

    if (cart.order) {
        record.order = orderEntityToOrderRecord(cart.order);
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