import { CartItem } from "../../cart_item/entity";
import { CartItemPersistor } from "../data/persistor";
import { cartItemEntityToCartItemRecord } from "../data/persistor/transformer";

export class CartItemManagement {

    async createCartItem(cartItem: CartItem): Promise<CartItem> {
        return new Promise<CartItem>(async (resolve, reject) => {
            try {
                let cartItemPersistor = new CartItemPersistor();
                resolve(await cartItemPersistor.createCartItem(cartItem));
            } catch (error) {
                reject(error);
            }
        });
    }

    async cartItemById(id: string): Promise<CartItem> {
        return new Promise<CartItem>(async (resolve, reject) => {
            try {
                let cartItemPersistor = new CartItemPersistor();
                resolve(await cartItemPersistor.cartItemById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartItemById(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let cartItemPersistor = new CartItemPersistor();
                resolve(await cartItemPersistor.deleteCartItemById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartItemsByIds(ids: string[]): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let cartItemPersistor = new CartItemPersistor();
                resolve(await cartItemPersistor.deleteCartItemsByIds(ids));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateCartItemById(id: string, cartItem: CartItem): Promise<CartItem> {
        return new Promise<CartItem>(async (resolve, reject) => {
            try {
                let cartItemPersistor = new CartItemPersistor();
                resolve(await cartItemPersistor.updateCartItemById(id, cartItem));
            } catch (error) {
                reject(error);
            }
        });
    }
}