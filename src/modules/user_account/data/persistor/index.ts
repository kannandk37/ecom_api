import mongoose from "mongoose";
import { UserAccount } from "../../entity";
import { UserAccountModel } from "../schema";
import { userAccountEntityToUserAccountRecord, userAccountRecordToUserAccountEntity } from "./transformer";
import { ObjectId } from "mongodb";
import ApiError from "../../../../exceptions/apierror";
import { StatusCodes } from "http-status-codes";

export class UserAccountPersistor {

    async userAccountByEmail(email: string): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            try {
                let existingUserAccount: any = await UserAccountModel.findOne(
                    {
                        email: email
                    });
                resolve(await userAccountRecordToUserAccountEntity(existingUserAccount));
            } catch (error) {
                reject(error);
            };
        });
    };

    async addEmailAccount(userAccount: UserAccount, transaction?: mongoose.ClientSession): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            try {
                let foundExistingUser = await UserAccountModel.findOne({
                    email: userAccount.email
                }).session(transaction);
                if (foundExistingUser) {
                    // throw new Error("user email already exists!!..")
                    return reject(
                        new ApiError("Profile email already exists", StatusCodes.BAD_REQUEST, true)
                    );
                } else {
                    let userAccountRecordData = userAccountEntityToUserAccountRecord(userAccount);
                    const [userAccountRecord] = await UserAccountModel.create([userAccountRecordData], { session: transaction });
                    resolve(await userAccountRecordToUserAccountEntity(userAccountRecord))
                }
            } catch (error) {
                reject(error);
            };
        });
    };

    async userAccountById(id: string): Promise<UserAccount> {
        return new Promise<UserAccount>(async (resolve, reject) => {
            try {
                let userAccount = await UserAccountModel.findOne({
                    _id: new ObjectId(id)
                })
                resolve(await userAccountRecordToUserAccountEntity(userAccount))
            } catch (error) {
                reject(error);
            };
        });
    };

    async updatePasswordById(id: string, password: string): Promise<UserAccount> {
        return new Promise<UserAccount>(async (resolve, reject) => {
            try {
                await UserAccountModel.findOneAndUpdate({
                    _id: new ObjectId(id)
                }, {
                    password: password
                })
                resolve(await this.userAccountById(id))
            } catch (error) {
                reject(error);
            };
        });
    };
}