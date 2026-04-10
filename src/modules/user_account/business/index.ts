import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { UserAccountPersistor } from "../data/persistor";
import { UserAccount } from "../entity";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export class UserAccountManagement {
    async userAccountByAccountIdentifier(userAccount: UserAccount): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            try {
                let userAccountPersistor = new UserAccountPersistor();
                let isExistingUser = await userAccountPersistor.userAccountByAccountIdentifier(userAccount);
                //TODO: can't handle it here sign up is breaking
                if (!isExistingUser) {
                    return reject(new ApiError("User Not Found", StatusCodes.NOT_FOUND));
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
                let isExistingUser = await userAccountPersistor.userAccountByAccountIdentifier(userAccount);
                if (!isExistingUser) {
                    return reject(new ApiError("Email Not Found", StatusCodes.NOT_FOUND));
                };
                //check password
                let isPasswordMatch = bcrypt.compareSync(userAccount.password, isExistingUser.password);
                if (!isPasswordMatch) {
                    return reject(new ApiError("Invalid Password", StatusCodes.BAD_REQUEST));
                };
                resolve(await this.generateToken(isExistingUser));
            } catch (error) {
                reject(error);
            };
        });
    };

    async generateToken(userAccount: UserAccount): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let token = jwt.sign(
                    { id: userAccount.user.id }, process.env.SECRET_KEY, { expiresIn: "8h" }
                );
                resolve(token);
            } catch (error) {
                reject(error);
            };
        });
    };
}