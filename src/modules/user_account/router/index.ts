import { Request, Response, Router } from "express";
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
import { RoleManagement } from "../../role/business";
import { RoleName } from "../../role/entity";
import { sendWelcomeEmail } from '../../../utils/emailService';
import path from "path";

export const userAccountRouter = Router();

userAccountRouter.post(
    '/signup',
    async (request: Request, response: Response) => {
        try {
            // create user entity
            let user = new User();

            // by default all are customer role only for this route
            let role = await new RoleManagement().getRoleByName(RoleName.CUSTOMER);
            user.roles = [role];

            let userManagement = new UserManagement();
            // create profile entity
            let profile = new Profile();
            profile.role = role;
            profile.name = request.body.name;
            profile.email = request.body.email;
            if (request.body.mobile) {
                profile.mobile = request.body.mobile
            };
            let profileManagement = new ProfileManagement();
            // create user Account entity
            let userAccount = new UserAccount();
            userAccount.email = request.body.email;
            userAccount.status = AccountStatus.ACTIVE;
            userAccount.password = request.body.password;
            userAccount.conformationCode = null;
            userAccount.resetConfirmationCode = null;
            userAccount.passwordResetedOn = new Date();
            let userAccountManagement = new UserAccountManagement();
            let existingUserAccount = await userAccountManagement.userAccountByEmail(userAccount);
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
                        user = newUser;
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

                // welcome email
                const welcomePromo = 'NATURE15';
                const headerImage = path.resolve(process.cwd(), '../data/banner.png');
                sendWelcomeEmail({
                    userEmail: profile.email,
                    userName: profile.name,
                    promoCode: welcomePromo,
                    // heroImageUrl: headerImage
                }).catch(() => console.log('unable to send welcome email'));

                response.status(StatusCodes.CREATED).send(new SuccessResponse(createdUser, "User successfully created", StatusCodes.CREATED));
            } else {
                response.status(StatusCodes.BAD_REQUEST).send(new ApiError("User already exists", StatusCodes.BAD_REQUEST));
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
            // TODO: if super admin or admin first time logs in then he need to be moved to password reset screen to change the dummy password
            let userAccountManagement = new UserAccountManagement();
            let userAccountInfo = new UserAccount();
            userAccountInfo.email = request.body.email;
            userAccountInfo.password = request.body.password;
            let userAccount = userAccountInfoToUserAccountEntity(userAccountInfo)
            let token = await userAccountManagement.loginExistingUser(userAccount);
            response.status(StatusCodes.CREATED).send(new SuccessResponse({ token: token }, "Login in successful", StatusCodes.CREATED));
        } catch (error: any) {
            errorhandler(error, response);
        };
    }
);
