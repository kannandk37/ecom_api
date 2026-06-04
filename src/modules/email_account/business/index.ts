import mongoose from "mongoose";
import { EmailAccountPersistor } from "../data/persistor";
import { EmailAccount } from "../entity";
import { UserAccountManagement } from "../../user_account/business";
import { User } from "../../user/entity";
import { Role } from "../../role/entity";
import ApiError from "../../../exceptions/apierror";
import { StatusCodes } from "http-status-codes";

export class EmailAccountManagement {
    async createEmailAccount(emailAccount: EmailAccount, transaction?: mongoose.ClientSession): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountPersistor = new EmailAccountPersistor();
                let emailAccountData = await emailAccountPersistor.createEmailAccount(emailAccount, transaction);
                resolve(emailAccountData);
            } catch (error) {
                reject(error);
            }
        });
    };

    async emailAccountByEmail(email: string): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountPersistor = new EmailAccountPersistor();
                let isExistingEmailAccount = await emailAccountPersistor.emailAccountByEmail(email);
                resolve(isExistingEmailAccount);
            } catch (error) {
                reject(error);
            }
        });
    };

    async emailAccountByRefreshToken(refreshToken: string): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountPersistor = new EmailAccountPersistor();
                let isExistingEmailAccount = await emailAccountPersistor.emailAccountByRefreshToken(refreshToken);
                resolve(isExistingEmailAccount);
            } catch (error) {
                reject(error);
            }
        });
    };

    async updateEmailAccount(emailAccount: EmailAccount, transaction?: mongoose.ClientSession): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountPersistor = new EmailAccountPersistor();
                let updatedEmailAccount = await emailAccountPersistor.updateEmailAccount(emailAccount, transaction);
                resolve(updatedEmailAccount);
            } catch (error) {
                reject(error);
            }
        });
    };

    async generateAccessTokenWithRefreshToken(refreshToken: string, user: User, role: Role): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountPersistor = new EmailAccountPersistor();
                let userAccountManagement = new UserAccountManagement();
                let isEmailAccountExitsForUser = await emailAccountPersistor.emailAccountByRefreshTokenAndUser(refreshToken, user.id);
                if (!isEmailAccountExitsForUser) {
                    return reject(new ApiError("Email Account Not Found", StatusCodes.BAD_REQUEST, true));
                } else {
                    let userAccount = await userAccountManagement.userAccountByEmail(isEmailAccountExitsForUser.email);
                    let accessToken = await userAccountManagement.generateToken(userAccount, role);
                    let refreshToken = await userAccountManagement.generateToken(userAccount, role, true);
                    isEmailAccountExitsForUser.accessToken = accessToken;
                    isEmailAccountExitsForUser.refreshToken = refreshToken;
                    isEmailAccountExitsForUser = await emailAccountPersistor.updateEmailAccount(isEmailAccountExitsForUser);
                }
                resolve(isEmailAccountExitsForUser);
            } catch (error) {
                reject(error);
            }
        });
    };
}