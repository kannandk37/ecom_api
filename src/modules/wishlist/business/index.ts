import { WishlistPersistor } from "../data/persistor";
import { Wishlist } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";

export class WishlistManagement {

    async toggleWishlist(userId: string, productId: string, variantId?: string): Promise<Wishlist | null> {
        return new Promise<Wishlist | null>(async (resolve, reject) => {
            try {
                let wishlistPersistor = new WishlistPersistor();
                let existing = await wishlistPersistor.wishlistByUserAndProductAndVariant(userId, productId, variantId);

                if (existing) {
                    await wishlistPersistor.deleteWishlistById(existing.id);
                    resolve(null);
                } else {
                    let newWishlist = new Wishlist();
                    newWishlist.user = { id: userId };
                    newWishlist.product = { id: productId };
                    if (variantId) {
                        newWishlist.variant = { id: variantId };
                    }
                    let created = await wishlistPersistor.createWishlist(newWishlist);
                    resolve(created);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async wishlistsByUserId(userId: string): Promise<Wishlist[]> {
        return new Promise<Wishlist[]>(async (resolve, reject) => {
            try {
                let wishlistPersistor = new WishlistPersistor();
                resolve(await wishlistPersistor.wishlistsByUserId(userId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async isWishlisted(userId: string, productId: string, variantId?: string): Promise<Wishlist | null> {
        return new Promise<Wishlist | null>(async (resolve, reject) => {
            try {
                let wishlistPersistor = new WishlistPersistor();
                let existing = await wishlistPersistor.wishlistByUserAndProductAndVariant(userId, productId, variantId);
                resolve(existing);
            } catch (error) {
                reject(error);
            }
        });
    }
}
