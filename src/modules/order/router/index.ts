import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { orderRawDatumToOrderEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { OrderManagement } from "../business";
import { StatusCodes } from "http-status-codes";

export const orderRouter = Router();

orderRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let orderInfo = orderRawDatumToOrderEntity(request.body.order);
        let persistedOrder = await new OrderManagement().createOrder(orderInfo);
        response.send(new SuccessResponse(await new OrderManagement().orderById(persistedOrder.id), 'Order created successfully', StatusCodes.CREATED))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

orderRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let orders = await new OrderManagement().orders();
        response.send(new SuccessResponse(orders, "Orders List", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

orderRouter.get('/user/:userid', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN, RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let userId = request.params.userId as string;
        let order = await new OrderManagement().ordersByUserId(userId);
        response.send(new SuccessResponse(order, "User's Orders", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

orderRouter.get('/:id/user/:userid', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN, RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let orderId = request.params.id as string;
        let userId = request.params.userId as string;
        let order = await new OrderManagement().orderByIdAndUserId(orderId, userId);
        response.send(new SuccessResponse(order, "User's Order of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

orderRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN, RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let orderId = request.params.id as string;
        let order = await new OrderManagement().orderById(orderId);
        response.send(new SuccessResponse(order, "Order of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});
