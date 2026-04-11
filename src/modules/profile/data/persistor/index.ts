import mongoose from "mongoose";
import { Profile } from "../../entity";
import { ProfileModel } from "../schema";
import { profileEntityToProfileRecord, profileRecordToProfileEntity } from "./transformer";
import { ObjectId } from "mongodb";
export class ProfilePersistor {
    async persistProfile(profile: Profile, transaction?: mongoose.ClientSession): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                let profileRecordData = profileEntityToProfileRecord(profile);
                let persistedProfileRecord: any = await ProfileModel.create([profileRecordData], { session: transaction });
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
                    email: email
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
                    user: new ObjectId(userId)
                });
                resolve(profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

}