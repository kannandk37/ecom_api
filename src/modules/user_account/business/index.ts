import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { UserAccountPersistor } from "../data/persistor";
import { UserAccount } from "../entity";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { Role } from "../../role/entity";
import { ProfileManagement } from "../../profile/business";
import { EmailAccountManagement } from "../../email_account/business";
import { EmailAccount } from "../../email_account/entity";

export class UserAccountManagement {
    async userAccountByEmail(email: string): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            try {
                let userAccountPersistor = new UserAccountPersistor();
                let isExistingUser = await userAccountPersistor.userAccountByEmail(email);
                //TODO: can't handle it here sign up is breaking
                // if (isExistingUser) {
                //     return reject(new ApiError("User Already Exists", StatusCodes.NOT_FOUND));
                // };
                resolve(isExistingUser);
            } catch (error) {
                reject(error);
            };
        });
    };

    async addEmailAccount(userAccount: UserAccount, transaction?: any): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            let encryptedPassword = await bcrypt.hash(userAccount.password, 10)
            userAccount.password = encryptedPassword
            let userAccountPersistor = new UserAccountPersistor();
            let addedEmailAccount = await userAccountPersistor.addEmailAccount(userAccount, transaction);
            resolve(addedEmailAccount)
        });
    };

    async loginExistingUser(userAccount: UserAccount): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let userAccountPersistor = new UserAccountPersistor();
                let isExistingUser = await userAccountPersistor.userAccountByEmail(userAccount.email);
                if (!isExistingUser) {
                    return reject(new ApiError("Email Not Found", StatusCodes.NOT_FOUND));
                };
                //check password
                let isPasswordMatch = bcrypt.compareSync(userAccount.password, isExistingUser.password);
                if (!isPasswordMatch) {
                    return reject(new ApiError("Invalid Password", StatusCodes.BAD_REQUEST));
                };
                let profile = await new ProfileManagement().profileByUserId(isExistingUser.user.id);


                let emailAccount = await new EmailAccountManagement().emailAccountByEmail(isExistingUser);

                if (!emailAccount) {
                    let emailAccountData = new EmailAccount();
                    emailAccountData.email = profile.email;
                    emailAccountData.user = profile.user;
                    await new EmailAccountManagement().createEmailAccount(emailAccountData);
                    return reject(new ApiError("Email Account Not Found", StatusCodes.BAD_REQUEST));
                }
                const token = await this.generateToken(isExistingUser, profile.role);

                let refreshToken = await this.generateToken(isExistingUser, profile.role, true);

                emailAccount.refreshToken = refreshToken;
                emailAccount.accessToken = token;

                await new EmailAccountManagement().updateEmailAccount(emailAccount);

                let result = {
                    id: profile.user.id,
                    user: profile.user,
                    profile: profile,
                    roles: profile.user.roles,
                    role: profile.role,
                    token: token,
                    refreshToken: refreshToken
                };
                resolve(result);
            } catch (error) {
                reject(error);
            };
        });
    };

    async generateToken(userAccount: UserAccount, role: Role, isRefreshToken?: boolean): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let token = jwt.sign(
                    { id: userAccount.user.id, role: { id: role.id, name: role.name } }, isRefreshToken ? process.env.JWT_REFRESH_SECRET_KEY : process.env.JWT_SECRET_KEY, { expiresIn: isRefreshToken ? process.env.JWT_REFRESH_EXPIRES_IN : process.env.JWT_EXPIRES_IN as any }
                );
                resolve(token);
            } catch (error) {
                reject(error);
            };
        });
    };
}