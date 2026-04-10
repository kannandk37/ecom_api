import { Response, Router } from "express";
import { Request } from "express";
import { UserAccountManagement } from "../business/index";
import { userAccountInfoToUserAccountEntity } from "./transformer";
import { UserManagement } from "../../user/business";
import { ProfileManagement } from "../../profile/business";
import { AccountStatus, UserAccount } from "../entity";
import { SuccessResponse } from "../../../exceptions/successHandler";
import { StatusCodes } from "http-status-codes";
import { errorhandler } from "../../../exceptions/errorhandler";
import ApiError from "../../../exceptions/apierror";
import { User } from "../../user/entity";
import { Profile } from "../../profile/entity";
import mongoose from "mongoose";

export const userAccountRouter = Router();

userAccountRouter.post(
    '/signup',
    async (request: Request, response: Response) => {
        try {
            // create user entity
            let user = new User();
            let userManagement = new UserManagement();
            // create profile entity
            let profile = new Profile();
            profile.name = request.body.name;
            profile.email = request.body.email;
            if (request.body.mobile) {
                profile.mobile = request.body.mobile
            };
            let profileManagement = new ProfileManagement();
            // create user Account entity
            let userAccount = new UserAccount(user);
            userAccount.accountIdentifier = request.body.email;
            userAccount.status = AccountStatus.ACTIVE;
            userAccount.password = request.body.password;
            userAccount.conformationCode = null;
            userAccount.resetConfirmationCode = null;
            userAccount.passwordResetedOn = new Date();
            let userAccountManagement = new UserAccountManagement();
            let existingUserAccount = await userAccountManagement.userAccountByAccountIdentifier(userAccount);
            if (!existingUserAccount) {
                // await sequelize.transaction(async (transaction: Transaction) => {
                // user = await userManagement.createUser(user, transaction);
                // await profileManagement.createProfile(profile, transaction);
                // await userAccountManagement.addEmailAccount(userAccount, transaction);
                // });
                const session = await mongoose.startSession();
                try {
                    await session.withTransaction(async () => {
                        // 1. Create User
                        // Pass the session as an option inside your createUser method
                        const newUser = await userManagement.createUser(user, session);

                        // 2. Link and Create Profile
                        profile.user = newUser;
                        await profileManagement.createProfile(profile, session);

                        // 3. Link and Add Account
                        userAccount.user = newUser;
                        await userAccountManagement.addEmailAccount(userAccount, session);
                    });

                    console.log("Transaction committed successfully.");
                } catch (error) {
                    console.error("Transaction aborted due to error:", error);
                    // withTransaction automatically aborts the transaction on error
                } finally {
                    await session.endSession();
                }

                // return newly created user
                // TODO userById show only return record from user table 
                // construct createUser with user, profile, tenant details (use getTenantById) 
                const createdUser = await userManagement.userById(user.id);
                response.send(new SuccessResponse(createdUser, "User successfully created", StatusCodes.CREATED));
            } else {
                response.send(new ApiError("User already exists", StatusCodes.BAD_REQUEST));
            };
        } catch (error: any) {
            errorhandler(error, response);
        };
    }
);

userAccountRouter.post(
    '/login',
    async (request: Request, response: Response) => {
        try {
            let userAccountManagement = new UserAccountManagement();
            let userAccountInfo = request.body
            let userAccount = userAccountInfoToUserAccountEntity(userAccountInfo)
            let token = await userAccountManagement.loginExistingUser(userAccount);
            response.send(new SuccessResponse({ token: token }, "Login in successful", StatusCodes.CREATED));
        } catch (error: any) {
            errorhandler(error, response);
        };
    }
);