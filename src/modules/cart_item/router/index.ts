import { Router, Response } from "express";
import { AuthenticatedRequest, specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { CartItemManagement } from "../business";
import { cartItemRawDatumToCartItemEntity } from "./transformer";
import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../../../exceptions/successHandler";

export const cartItemRouter = Router();

cartItemRouter.put('/:id', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let cartItemId = request.params.id as string;
        let cartItem = cartItemRawDatumToCartItemEntity(request.body.cartItem);
        let updatedCartItem = await new CartItemManagement().updateCartItemById(cartItemId, cartItem);
        response.status(StatusCodes.OK).send(new SuccessResponse(updatedCartItem, 'Cart Item Update Successfully', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});