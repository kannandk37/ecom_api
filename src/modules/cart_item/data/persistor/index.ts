import { cartItemEntityToCartItemRecord, cartItemRecordToCartItemEntity } from "../../../cart_item/data/persistor/transformer";
import { CartItemModel } from "../../../cart_item/data/schema";
import { CartItem } from "../../../cart_item/entity";
import { ObjectId } from "mongodb";
import { productPopulate } from "../../../variant/data/persistor";
import { variantPopulate } from "../../../order_item/data/persistor";

export class CartItemPersistor {
    async createCartItem(cartItem: CartItem): Promise<CartItem> {
        return new Promise<CartItem>(async (resolve, reject) => {
            try {
                let cartItemData = cartItemEntityToCartItemRecord(cartItem);
                let cartItemRecord = await CartItemModel.create(cartItemData);
                resolve(await this.cartItemById(cartItemRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async cartItemById(id: string): Promise<CartItem> {
        return new Promise<CartItem>(async (resolve, reject) => {
            try {
                let cartItemRecord = await CartItemModel.findOne({ _id: new ObjectId(id) }).populate([productPopulate(), variantPopulate()]);
                resolve(await cartItemRecordToCartItemEntity(cartItemRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartItemById(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let cartItemRecord = await CartItemModel.deleteOne({ _id: new ObjectId(id) });
                resolve(cartItemRecord.acknowledged);
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartItemsByIds(ids: string[]): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let cartItemRecord = await CartItemModel.deleteMany({ _id: { $in: ids.map((id) => new ObjectId(id)) } });
                resolve(cartItemRecord.acknowledged);
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateCartItemById(id: string, cartItem: CartItem): Promise<CartItem> {
        return new Promise<CartItem>(async (resolve, reject) => {
            try {
                let cartItemData = cartItemEntityToCartItemRecord(cartItem);
                await CartItemModel.updateOne({
                    _id: new ObjectId(id)
                }, cartItemData);
                resolve(await this.cartItemById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}