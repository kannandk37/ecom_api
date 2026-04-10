import mongoose from "mongoose";
import { User } from "../../entity";
import { UserModel } from "../schema";
import { userRecordTouserEntity } from "./transformer";
import { ObjectId } from "mongodb";

export class UserPersistor {
    async persistUser(user: User, transaction?: mongoose.ClientSession): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let userRecord = await UserModel.create([{
                    roles: user.roles?.map((role) => new ObjectId(role.id))
                }], { session: transaction });
                resolve(userRecordTouserEntity(userRecord))
            } catch (error) {
                reject(error)
            }
        })
    }

    async userById(id: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let userRecord = await UserModel.findOne(
                    {
                        where: { id: id }
                    });
                resolve(userRecordTouserEntity(userRecord))
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
}