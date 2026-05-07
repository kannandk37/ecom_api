import { populate } from "dotenv";
import { userPopulate } from "../../../address/data/persistor";
import { CartItemModel } from "../../../cart_item/data/schema";
import { CartItem } from "../../../cart_item/entity";
import { Cart } from "../../entity";
import { CartModel } from "../schema";
import { cartEntityToCartRecord, cartRecordToCartEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { ProductModel } from "../../../product/data/schema";
import { VariantModel } from "../../../variant/data/schema";

export class CartPersistor {

    async createCart(cart: Cart): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartData = cartEntityToCartRecord(cart);
                let cartRecord = await CartModel.create(cartData);
                resolve(await this.cartById(cartRecord._id.toString()));
            } catch (error) {
                reject(error);
            }
        });
    }

    async cartById(id: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartRecord = await CartModel.findOne({ _id: new ObjectId(id) }).populate([userPopulate(), cartItemsPopulate()]);
                resolve(await cartRecordToCartEntity(cartRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async cartByUserId(userId: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartRecord = await CartModel.findOne({ user: new ObjectId(userId) }).populate([userPopulate(), cartItemsPopulate()]);
                resolve(await cartRecordToCartEntity(cartRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartById(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let cartRecord = await CartModel.deleteOne({ _id: new ObjectId(id) });
                resolve(cartRecord.acknowledged);
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateCartItemsOfCartById(id: string, cartItems: CartItem[]): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                await CartModel.updateOne({ _id: new ObjectId(id) }, { cartItems: cartItems.map((el) => new ObjectId(el.id)) });
                resolve(await this.cartById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartItemInCartItemsOfCartById(id: string, cartItemId: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                await CartModel.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $pull: {
                            cartItems: new ObjectId(cartItemId)
                        }
                    }
                );
                resolve(await this.cartById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}

export function cartItemsPopulate() {
    return {
        path: 'cartItems',
        model: CartItemModel,
        populate: [{
            path: "product",
            model: ProductModel
        },
        {
            path: "variant",
            model: VariantModel
        }]
    }
}