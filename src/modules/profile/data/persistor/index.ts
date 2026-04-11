import mongoose from "mongoose";
import { Profile } from "../../entity";
import { ProfileModel } from "../schema";
import { profileEntityToProfileRecord, profileRecordToProfileEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { RoleModel } from "../../../role/data/schema";
export class ProfilePersistor {
    async persistProfile(profile: Profile, transaction?: mongoose.ClientSession): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                profile.lastLogin = new Date();
                let profileRecordData = profileEntityToProfileRecord(profile);
                let [persistedProfileRecord] = await ProfileModel.create([profileRecordData], { session: transaction });
                resolve(profileRecordToProfileEntity(persistedProfileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByEmail(email: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
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
                }).populate({
                    path: 'role',
                    model: RoleModel
                });
                resolve(profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

}