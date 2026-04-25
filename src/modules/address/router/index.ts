import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { RoleName } from "../../role/entity";
import { errorhandler } from "../../../exceptions/errorhandler";
import { addressRawDatumToAddressEntity } from "./transformer";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { AddressManagement } from "../business";
import { StatusCodes } from "http-status-codes";


export const addressRouter = Router();

addressRouter.post('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.SUPERADMIN, RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let addressInfo = addressRawDatumToAddressEntity(request.body.address);
        let persistedAddress = await new AddressManagement().createAddress(addressInfo);
        response.send(new SuccessResponse(await new AddressManagement().addressById(persistedAddress.id), 'Address created successfully', StatusCodes.CREATED))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

addressRouter.get('/', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN]), async (request: Request, response: Response) => {
    try {
        let addresses = await new AddressManagement().addresses();
        response.send(new SuccessResponse(addresses, "Addresses List", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});

addressRouter.get('/:id', verifyToken, specificRolesOnly([RoleName.ADMIN, RoleName.CUSTOMER, RoleName.SUPERADMIN, RoleName.CUSTOMER]), async (request: Request, response: Response) => {
    try {
        let addressId = request.params.id as string;
        let address = await new AddressManagement().addressById(addressId);
        response.send(new SuccessResponse(address, "Address of Id", StatusCodes.OK))
    } catch (error: any) {
        errorhandler(error, response);
    }
});