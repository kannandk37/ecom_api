import mongoose from "mongoose";
import { EmailAccount } from "../../entity";
import { EmailAccountModel } from "../schema";
import { emailAccountEntityToEmailAccountRecord, emailAccountRecordToEmailAccountEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { userPopulate } from "../../../address/data/persistor";

export class EmailAccountPersistor {

    async createEmailAccount(emailAccount: EmailAccount, transaction?: mongoose.ClientSession): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountData = emailAccountEntityToEmailAccountRecord(emailAccount);
                let emailAccountRecord = await EmailAccountModel.create([emailAccountData], { session: transaction });
                let emailAccountEntity = emailAccountRecordToEmailAccountEntity(emailAccountRecord);
                resolve(emailAccountEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    async emailAccountByEmail(emailAccount: EmailAccount): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountRecord = await EmailAccountModel.findOne({ email: emailAccount.email }).populate([userPopulate()]);
                let emailAccountEntity = emailAccountRecordToEmailAccountEntity(emailAccountRecord);
                resolve(emailAccountEntity);
            } catch (error) {
                reject(error);
            }
        });
    };

    async emailAccountByRefreshToken(refreshToken: string): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountRecord = await EmailAccountModel.findOne({ refreshToken: refreshToken }).populate([userPopulate()]);
                let emailAccountEntity = emailAccountRecordToEmailAccountEntity(emailAccountRecord);
                resolve(emailAccountEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateEmailAccount(emailAccount: EmailAccount, transaction?: any): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountData = emailAccountEntityToEmailAccountRecord(emailAccount);
                let emailAccountRecord = await EmailAccountModel.findOneAndUpdate({ _id: emailAccountData._id }, emailAccountData, { new: true, session: transaction });
                let emailAccountEntity = emailAccountRecordToEmailAccountEntity(emailAccountRecord);
                resolve(emailAccountEntity);
            } catch (error) {
                reject(error);
            }
        });
    }

    async emailAccountByRefreshTokenAndUser(refreshToken: string, userId: string): Promise<EmailAccount> {
        return new Promise<EmailAccount>(async (resolve, reject) => {
            try {
                let emailAccountRecord = await EmailAccountModel.findOne({ refreshToken: refreshToken, user: new ObjectId(userId) }).populate([userPopulate()]);
                let emailAccountEntity = emailAccountRecordToEmailAccountEntity(emailAccountRecord);
                resolve(emailAccountEntity);
            } catch (error) {
                reject(error);
            }
        });
    }
}