import mongoose from "mongoose";
import { Profile } from "../../entity";
import { ProfileModel } from "../schema";
import { profileRecordToProfileEntity } from "./transformer";
import { ObjectId } from "mongodb";
export class ProfilePersistor {
    async persistProfile(profile: Profile, transaction?: mongoose.ClientSession): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                let persistedProfileRecord: any = await ProfileModel.create([
                    {
                        name: profile.name,
                        email: profile.email,
                        user: new ObjectId(profile.user?.id),
                        mobile: profile.mobile,
                    }], { session: transaction });
                resolve(profileRecordToProfileEntity(persistedProfileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByEmail(email: string): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                let profileRecord: any = await ProfileModel.findOne({
                    where: { email: email }
                });
                resolve(profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByUserId(userId: string): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                let profileRecord = await ProfileModel.findOne({
                    where: { user: new ObjectId(userId) }
                });
                resolve(profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

}