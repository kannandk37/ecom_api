import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { CartItem } from "../../entity";

export function cartItemRawDatumToCartItemEntity(raw: any): CartItem {
    let cart = new CartItem();

    if (raw === null) {
        return cart = null;
    }

    if (raw.id) {
        cart.id = raw.id;
    }

    if (raw.product) {
        cart.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        cart.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    return cart;
}

export function cartItemsRawDataToCartItemsEntities(raws: any[]): CartItem[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(cartItemRawDatumToCartItemEntity);
}