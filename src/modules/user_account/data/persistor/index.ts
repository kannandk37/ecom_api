import mongoose from "mongoose";
import { UserAccount } from "../../entity";
import { UserAccountModel } from "../schema";
import { userAccountEntityToUserAccountRecord, userAccountRecordToUserAccountEntity } from "./transformer";
import { ObjectId } from "mongodb";
import ApiError from "../../../../exceptions/apierror";
import { StatusCodes } from "http-status-codes";

export class UserAccountPersistor {
    async userAccountByAccountIdentifier(userAccount: UserAccount): Promise<UserAccount> {
        return new Promise(async (resolve, reject) => {
            try {
                let existingUserAccount: any = await UserAccountModel.findOne(
                    {
                        accountIdentifier: userAccount.accountIdentifier
                    });
                resolve(userAccountRecordToUserAccountEntity(existingUserAccount));
            } catch (error) {
                reject(error);
            };
        });
    };

    async addEmailAccount(userAccount: UserAccount, transaction?: mongoose.ClientSession): Promise<UserAccount | string> {
        return new Promise(async (resolve, reject) => {
            try {
                let foundExistingUser = await UserAccountModel.findOne({
                    accountIdentifier: userAccount.accountIdentifier
                }).session(transaction);
                if (foundExistingUser) {
                    // throw new Error("user email already exists!!..")
                    return reject(
                        new ApiError("Profile email already exists", StatusCodes.BAD_REQUEST)
                    );
                } else {
                    let userAccountRecordData = userAccountEntityToUserAccountRecord(userAccount);
                    const [userAccountRecord] = await UserAccountModel.create([userAccountRecordData], { session: transaction });
                    resolve(userAccountRecordToUserAccountEntity(userAccountRecord))
                }
            } catch (error) {
                reject(error);
            };
        });
    };
}