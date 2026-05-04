import { Request, Response, Router } from "express";
import { specificRolesOnly, verifyToken } from "../../../middlewares/authMiddleware";
import { errorhandler } from "../../../exceptions/errorhandler";
import { UserManagement } from "../business";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { RoleName } from "../../role/entity";
import { userRawDatumToUserEntity } from "./transformer";
import { roleRawDatumToRoleEntity } from "../../role/router/transformer";
import { profileRawDatumToProfileEntity } from "../../profile/router/transformer";
import { userAccountRawDatumToUserAccountEntity } from "../../user_account/router/transformer";
import ApiError from "../../../exceptions/apierror";
import { UserAccountManagement } from "../../user_account/business";
import mongoose from "mongoose";
import { ProfileManagement } from "../../profile/business";
import path from "path";
import { userOnBoardingPasswordReset } from "../../../utils/emailService";

export const userRouter = Router();

userRouter.post('/onboarding', verifyToken, specificRolesOnly([RoleName.SUPERADMIN, RoleName.ADMIN]), async (request: Request, response: Response) => {
    try {
        let userManagement = new UserManagement();
        let user = userRawDatumToUserEntity(request.body.user);
        let role = roleRawDatumToRoleEntity(request.body.role);
        let profile = profileRawDatumToProfileEntity(request.body.profile);
        let userAccount = userAccountRawDatumToUserAccountEntity(request.body.userAccount);
        let password = userAccount.password;
        let userAccountManagement = new UserAccountManagement();
        let existingUserAccount = await userAccountManagement.userAccountByEmail(userAccount);
        if (!existingUserAccount) {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {

                    const newUser = await userManagement.createUser(user, session);

                    profile.user = newUser;
                    await new ProfileManagement().createProfile(profile, session);

                    userAccount.user = newUser;
                    await userAccountManagement.addEmailAccount(userAccount, session);
                    user = newUser;
                });

                console.log("Transaction committed successfully.");
            } catch (error) {
                console.error("Transaction aborted due to error:", error);
            } finally {
                await session.endSession();
            }

            const createdUser = await userManagement.userById(user.id);

            userOnBoardingPasswordReset({
                userEmail: profile.email,
                userName: profile.name,
                password: password,
                roleName: createdUser?.profile?.role?.name
                // heroImageUrl: headerImage
            }).catch(() => console.log('unable to send welcome email'));

            response.status(StatusCodes.CREATED).send(new SuccessResponse(createdUser, "User successfully created", StatusCodes.CREATED));
        } else {
            response.status(StatusCodes.BAD_REQUEST).send(new ApiError("User already exists", StatusCodes.BAD_REQUEST));
        }
    } catch (error: any) {
        errorhandler(error, response);
    }
});

userRouter.get('/', verifyToken, specificRolesOnly([RoleName.SUPERADMIN, RoleName.ADMIN]), async (request: Request, response: Response) => {
    try {
        let userManagement = new UserManagement();
        response.status(StatusCodes.OK).send(new SuccessResponse(await userManagement.users(), 'Users List', StatusCodes.OK));
    } catch (error: any) {
        errorhandler(error, response);
    }
});