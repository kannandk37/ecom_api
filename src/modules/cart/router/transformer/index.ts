import { orderRawDatumToOrderEntity } from "../../../order/router/transformer";
import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { Cart } from "../../entity";

export function cartRawDatumToCartEntity(raw: any): Cart {
    let cart = new Cart();

    if (raw === null) {
        return cart = null;
    }

    if (raw.id) {
        cart.id = raw.id;
    }

    if (raw.user) {
        cart.user = userRawDatumToUserEntity(raw.user);
    }

    if (raw.order) {
        cart.order = orderRawDatumToOrderEntity(raw.order);
    }

    return cart;
}

export function cartsRawDataToCartsEntities(raws: any[]): Cart[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(cartRawDatumToCartEntity);
}