import { userPopulate } from "../../../address/data/persistor";
import { variantPopulate } from "../../../order_item/data/persistor";
import { productPopulate } from "../../../variant/data/persistor";
import { Wishlist } from "../../entity";
import { WishlistModel } from "../schema";
import {
    wishlistEntityToWishlistRecord,
    wishlistRecordToWishlistEntity,
    wishlistsRecordsToWishlistsEntities
} from "./transformer";
import { ObjectId } from "mongodb";

export class WishlistPersistor {

    async createWishlist(wishlist: Wishlist): Promise<Wishlist> {
        return new Promise<Wishlist>(async (resolve, reject) => {
            try {
                let wishlistData = wishlistEntityToWishlistRecord(wishlist);
                let wishlistRecord = await WishlistModel.create(wishlistData);
                resolve(await this.wishlistById(wishlistRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async wishlistById(id: string): Promise<Wishlist> {
        return new Promise<Wishlist>(async (resolve, reject) => {
            try {
                let wishlistRecord = await WishlistModel.findOne({ _id: new ObjectId(id) }).populate([userPopulate(), productPopulate(), variantPopulate()]);
                resolve(wishlistRecordToWishlistEntity(wishlistRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async wishlistsByUserId(userId: string): Promise<Wishlist[]> {
        return new Promise<Wishlist[]>(async (resolve, reject) => {
            try {
                let wishlistRecords = await WishlistModel
                    .find({ user: new ObjectId(userId) })
                    .sort({ createdAt: -1 })
                    .populate([userPopulate(), productPopulate(), variantPopulate()]);
                resolve(wishlistsRecordsToWishlistsEntities(wishlistRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async wishlistByUserAndProductAndVariant(userId: string, productId: string, variantId: string): Promise<Wishlist> {
        return new Promise<Wishlist>(async (resolve, reject) => {
            try {
                let query: any = {
                    user: new ObjectId(userId),
                    product: new ObjectId(productId)
                };
                if (variantId) {
                    query.variant = new ObjectId(variantId);
                }
                let wishlistRecord = await WishlistModel.findOne(query).populate([userPopulate(), productPopulate(), variantPopulate()]);
                resolve(wishlistRecordToWishlistEntity(wishlistRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteWishlistById(id: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await WishlistModel.deleteOne({ _id: new ObjectId(id) });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}
