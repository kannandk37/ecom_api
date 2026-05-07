import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { CartItem } from "../../entity";

export function cartItemRawDatumToCartItemEntity(raw: any): CartItem {
    let cartItem = new CartItem();

    if (raw === null) {
        return cartItem = null;
    }

    if (raw.id) {
        cartItem.id = raw.id;
    }

    if (raw.product) {
        cartItem.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        cartItem.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    if (raw.quantity) {
        cartItem.quantity = raw.quantity;
    }

    return cartItem;
}

export function cartItemsRawDataToCartItemsEntities(raws: any[]): CartItem[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(cartItemRawDatumToCartItemEntity);
}