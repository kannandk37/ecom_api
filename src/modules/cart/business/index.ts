import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { CartItemManagement } from "../../cart_item/business";
import { CartItem } from "../../cart_item/entity";
import { CartPersistor } from "../data/persistor";
import { Cart } from "../entity";

export class CartManagement {

    async createCart(cart: Cart): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartPersistor = new CartPersistor();
                let createCartItems: CartItem[] = [];
                if (cart.cartItems.length > 0) {
                    for (const item of cart.cartItems) {
                        let cartItem = await new CartItemManagement().createCartItem(item);
                        createCartItems.push(cartItem);
                    }
                }
                cart.cartItems = createCartItems;
                let createdCart = await cartPersistor.createCart(cart);
                resolve(createdCart);
            } catch (error) {
                reject(error);
            }
        });
    }

    async cartById(id: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartPersistor = new CartPersistor();
                resolve(await cartPersistor.cartById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async cartByUserId(userId: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartPersistor = new CartPersistor();
                resolve(await cartPersistor.cartByUserId(userId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartItemFromCartByCartIdandCartItemId(id: string, cartItemId: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartPersistor = new CartPersistor();
                let cart = await cartPersistor.cartById(id);
                if (cart && cart?.id && cart.cartItems.find((el) => el.id == cartItemId)) {
                    let removedCartItem = await new CartItemManagement().deleteCartItemById(cartItemId);
                    await cartPersistor.deleteCartItemInCartItemsOfCartById(id, cartItemId);
                    resolve(await this.cartById(id));
                } else {
                    reject(new ApiError('Unable To Remove Cart Item', StatusCodes.BAD_REQUEST));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteCartById(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let cartPersistor = new CartPersistor();
                let cart = await cartPersistor.cartById(id);
                await new CartItemManagement().deleteCartItemsByIds(cart.cartItems?.map((el) => el.id))
                resolve(await cartPersistor.deleteCartById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async createCartItemAndUpdateCartItemsOfCartById(id: string, cartItem: CartItem): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                let cartPersistor = new CartPersistor();
                let persistedCartItem = await new CartItemManagement().createCartItem(cartItem);
                let cart = await this.cartById(id);
                let cartItems = cart.cartItems?.length > 0 ? cart.cartItems : []
                cartItems?.push(persistedCartItem);
                resolve(await cartPersistor.updateCartItemsOfCartById(id, cartItems));
            } catch (error) {
                reject(error);
            }
        });
    }
}