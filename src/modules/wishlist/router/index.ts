import { Request, Response, Router } from "express";
import { AuthenticatedRequest, specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { WishlistManagement } from "../business";
import { StatusCodes } from "http-status-codes";

export const wishlistRouter = Router();

wishlistRouter.post('/toggle', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let { userId, productId, variantId } = request.body;
        let result = await new WishlistManagement().toggleWishlist(userId, productId, variantId);
        let message = result ? 'Added to wishlist' : 'Removed from wishlist';
        let statusCode = result ? StatusCodes.CREATED : StatusCodes.NO_CONTENT;
        response.status(statusCode).send(new SuccessResponse(result, message, statusCode));
    } catch (error: any) {
        errorhandler(error, response);
    }
});


wishlistRouter.get('/me', verifyToken, specificRolesOnly([RoleName.CUSTOMER, RoleName.ADMIN, RoleName.SUPERADMIN]), async (request: AuthenticatedRequest, response: Response) => {
    try {
        let userId = request.user.id;
        let wishlists = await new WishlistManagement().wishlistsByUserId(userId);
        response.status(StatusCodes.OK).send(new SuccessResponse(wishlists, 'Wishlist by user', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});

wishlistRouter.get('/check', verifyToken, specificRolesOnly([RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let userId = request.query.userId as string;
        let productId = request.query.productId as string;
        let variantId = request.query.variantId as string;
        let wishlist = await new WishlistManagement().isWishlisted(userId, productId, variantId);
        response.status(StatusCodes.OK).send(new SuccessResponse(wishlist, 'Wishlist check', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});
