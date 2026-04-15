import { cartItemsRawDataToCartItemsEntities } from "../../../cart_item/router/transformer";
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

    if (raw?.cartItems && raw?.cartItems?.length > 0) {
        cart.cartItems = cartItemsRawDataToCartItemsEntities(raw.cartItems);
    }

    if (raw?.appliedPromocode) {
        cart.appliedPromocode = raw.appliedPromocode
    }

    if (raw.isActive != undefined) {
        cart.isActive = raw.isActive
    }

    return cart;
}

export function cartsRawDataToCartsEntities(raws: any[]): Cart[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(cartRawDatumToCartEntity);
}