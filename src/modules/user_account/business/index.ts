import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { UserAccountPersistor } from "../data/persistor";
import { UserAccount } from "../entity";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { Role } from "../../role/entity";
import { ProfileManagement } from "../../profile/business";

export class UserAccountManagement {
    async userAccountByEmail(userAccount: UserAccount): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            try {
                let userAccountPersistor = new UserAccountPersistor();
                let isExistingUser = await userAccountPersistor.userAccountByEmail(userAccount);
                //TODO: can't handle it here sign up is breaking
                if (isExistingUser) {
                    return reject(new ApiError("User Already Exists", StatusCodes.NOT_FOUND));
                };
                resolve(isExistingUser);
            } catch (error) {
                reject(error);
            };
        });
    };

    async addEmailAccount(userAccount: UserAccount, transaction?: any): Promise<string | UserAccount> {
        return new Promise(async (resolve, reject) => {
            let encryptedPassword = await bcrypt.hash(userAccount.password, 10)
            userAccount.password = encryptedPassword
            let userAccountPersistor = new UserAccountPersistor();
            let addedEmailAccount = await userAccountPersistor.addEmailAccount(userAccount, transaction);
            resolve(addedEmailAccount)
        });
    };

    async loginExistingUser(userAccount: UserAccount): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let userAccountPersistor = new UserAccountPersistor();
                let isExistingUser = await userAccountPersistor.userAccountByEmail(userAccount);
                if (!isExistingUser) {
                    return reject(new ApiError("Email Not Found", StatusCodes.NOT_FOUND));
                };
                //check password
                let isPasswordMatch = bcrypt.compareSync(userAccount.password, isExistingUser.password);
                if (!isPasswordMatch) {
                    return reject(new ApiError("Invalid Password", StatusCodes.BAD_REQUEST));
                };
                let profile = await new ProfileManagement().profileByUserId(isExistingUser.user.id);
                resolve(await this.generateToken(isExistingUser, profile.role));
            } catch (error) {
                reject(error);
            };
        });
    };

    async generateToken(userAccount: UserAccount, role: Role): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let token = jwt.sign(
                    { id: userAccount.user.id, role: { id: role.id, name: role.name } }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN as any }
                );
                resolve(token);
            } catch (error) {
                reject(error);
            };
        });
    };
}