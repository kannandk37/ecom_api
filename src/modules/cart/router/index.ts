import { Request, Response, Router } from "express";
import { AuthenticatedRequest, specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { CartManagement } from "../business";
import { Cart } from "../entity";
import { cartRawDatumToCartEntity } from "./transformer";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../../../exceptions/successHandler";

export const cartRouter = Router();

cartRouter.post('/add', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let cart = cartRawDatumToCartEntity(request.body.cart);
        cart.user = request.user;
        let usersCart = await new CartManagement().cartByUserId(request.user.id);
        if (usersCart?.id) {
            let updatedCart = await new CartManagement().createCartItemAndUpdateCartItemsOfCartById(usersCart.id, cart.cartItems[0]);
            response.status(StatusCodes.OK).send(new SuccessResponse(updatedCart, 'Cart Created Successfully for User', StatusCodes.OK));
        } else {
            let persistedCart = await new CartManagement().createCart(cart);
            response.status(StatusCodes.CREATED).send(new SuccessResponse(persistedCart, 'Cart Created Successfully for User', StatusCodes.CREATED));
        }
    } catch (error: any) {
        errorhandler(error, response);
    }
});

cartRouter.get('/me', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let cart = await new CartManagement().cartByUserId(request.user.id);
        response.status(StatusCodes.OK).send(new SuccessResponse(cart, `User's Cart`, StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

cartRouter.delete('/:cartId/items/:itemId', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let cartId = request.params.cartId as string;
        let cartItemId = request.params.itemId as string;
        let cart = await new CartManagement().deleteCartItemFromCartByCartIdandCartItemId(cartId, cartItemId);
        response.status(StatusCodes.OK).send(new SuccessResponse(cart, `Item Removed from Cart`, StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

cartRouter.delete('/clear', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let cartManagement = new CartManagement();
        let cart = await cartManagement.cartByUserId(request.user.id);
        let deletedCart = await cartManagement.deleteCartById(cart.id);
        response.status(StatusCodes.OK).send(new SuccessResponse(deletedCart, `User's Cart Cleared Succeddfully`, StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});