import mongoose from "mongoose";
import { User } from "../../entity";
import { UserModel } from "../schema";
import { userEntityToUserRecord, usersRecordsToUsersEntities, userRecordToUserEntity } from "./transformer";
import { ObjectId } from "mongodb";

export class UserPersistor {
    async persistUser(user: User, transaction?: mongoose.ClientSession): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let userRecordData = userEntityToUserRecord(user);
                let [userRecord] = await UserModel.create([userRecordData], { session: transaction });
                resolve(await userRecordToUserEntity(userRecord))
            } catch (error) {
                reject(error)
            }
        })
    }

    async userById(id: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let userRecord = await UserModel.findOne(
                    { _id: new ObjectId(id) }
                );
                resolve(await userRecordToUserEntity(userRecord))
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    async users() {
        return new Promise<User[]>(async (resolve, reject) => {
            try {
                let userRecords = await UserModel.find();
                resolve(await usersRecordsToUsersEntities(userRecords));
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
}