import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { variantRawDatumToVariantEntity } from "../../../variant/router/transformer";
import { Wishlist } from "../../entity";

export function wishlistRawDatumToWishlistEntity(raw: any): Wishlist {
    let wishlist = new Wishlist();

    if (raw === null || raw === undefined) {
        return wishlist = null;
    }

    if (raw.id) {
        wishlist.id = raw.id;
    }

    if (raw.user) {
        wishlist.user = userRawDatumToUserEntity(raw.user);
    }

    if (raw.product) {
        wishlist.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.variant) {
        wishlist.variant = variantRawDatumToVariantEntity(raw.variant);
    }

    return wishlist;
}

export function wishlistsRawDataToWishlistsEntities(raws: any[]): Wishlist[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(wishlistRawDatumToWishlistEntity);
}
