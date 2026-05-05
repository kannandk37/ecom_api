import { productRecordToProductEntity } from "../../../../product/data/persistor/transformer";
import { userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { variantRecordToVariantEntity } from "../../../../variant/data/persistor/transformer";
import { Wishlist } from "../../../entity";
import { ObjectId } from "mongodb";

export function wishlistRecordToWishlistEntity(wishlistRecord: any): Wishlist {
    let wishlist = new Wishlist();

    if (wishlistRecord === null || wishlistRecord === undefined) {
        return wishlist = null;
    }

    if (wishlistRecord._id) {
        wishlist.id = wishlistRecord._id?.toString();
    }

    if (wishlistRecord.user) {
        wishlist.user = userRecordToUserEntity(wishlistRecord.user)
    }

    if (wishlistRecord.product) {
        wishlist.product = productRecordToProductEntity(wishlistRecord.product)
    }

    if (wishlistRecord.variant) {
        wishlist.variant = variantRecordToVariantEntity(wishlistRecord.variant)
    }

    if (wishlistRecord.createdAt) {
        wishlist.createdAt = wishlistRecord.createdAt;
    }

    return wishlist;
}

export function wishlistEntityToWishlistRecord(wishlist: Wishlist): object {
    let record: any = {};

    if (wishlist === null || wishlist === undefined) {
        return record = null;
    }

    if (wishlist.id) {
        record._id = new ObjectId(wishlist.id);
    }

    if (wishlist.user?.id) {
        record.user = new ObjectId(wishlist.user.id);
    }

    if (wishlist.product?.id) {
        record.product = new ObjectId(wishlist.product.id);
    }

    if (wishlist.variant?.id) {
        record.variant = new ObjectId(wishlist.variant.id);
    }

    return record;
}

export function wishlistsRecordsToWishlistsEntities(wishlistRecords: any[]): Wishlist[] {
    if (!wishlistRecords || wishlistRecords.length === 0) {
        return [];
    }
    return wishlistRecords.map((record) => wishlistRecordToWishlistEntity(record));
}


export function wishlistsEntitesToWishlistsRecords(wishlists: Wishlist[]): any[] {
    if (!wishlists || wishlists.length === 0) {
        return [];
    }
    return wishlists.map((wishlist) => wishlistEntityToWishlistRecord(wishlist));
}
