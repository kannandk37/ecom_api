import mongoose from "mongoose";
import { Profile } from "../../entity";
import { ProfileModel } from "../schema";
import { profileEntityToProfileRecord, profileRecordToProfileEntity, profilesRecordsToProfilesEntities } from "./transformer";
import { ObjectId } from "mongodb";
import { RoleModel } from "../../../role/data/schema";
import { userPopulate } from "../../../address/data/persistor";
export class ProfilePersistor {
    async persistProfile(profile: Profile, transaction?: mongoose.ClientSession): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                profile.lastLogin = new Date();
                let profileRecordData = profileEntityToProfileRecord(profile);
                let [persistedProfileRecord] = await ProfileModel.create([profileRecordData], { session: transaction });
                resolve(await profileRecordToProfileEntity(persistedProfileRecord));
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
                }).populate([userPopulate(), rolePopulate()]);
                resolve(await profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByMobile(mobile: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profileRecord: any = await ProfileModel.findOne({
                    mobile: mobile
                }).populate([userPopulate(), rolePopulate()]);
                resolve(await profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByUserId(userId: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profileRecord = await ProfileModel.findOne({
                    user: new ObjectId(userId)
                }).populate([userPopulate(), rolePopulate()]);
                resolve(await profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByUserIdAndRoleId(userId: string, roleId: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profileRecord = await ProfileModel.findOne({
                    user: new ObjectId(userId),
                    role: new ObjectId(roleId)
                }).populate([userPopulate(), rolePopulate()]);
                resolve(await profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileById(id: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profileRecord = await ProfileModel.findOne({
                    _id: new ObjectId(id)
                }).populate([userPopulate(), rolePopulate()]);
                resolve(await profileRecordToProfileEntity(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profiles(): Promise<Profile[]> {
        return new Promise<Profile[]>(async (resolve, reject) => {
            try {
                let profileRecords = await ProfileModel.find().populate([userPopulate(), rolePopulate()]);
                resolve(await profilesRecordsToProfilesEntities(profileRecords));
            } catch (error) {
                reject(error);
            }
        });
    }

    async profileByRoleIds(roleIds: string[]): Promise<Profile[]> {
        return new Promise<Profile[]>(async (resolve, reject) => {
            try {
                let profileRecord = await ProfileModel.find({
                    role: { $in: roleIds?.map((el: string) => new ObjectId(el)) }
                }).populate([userPopulate(), rolePopulate()]);
                resolve(await profilesRecordsToProfilesEntities(profileRecord));
            } catch (error) {
                reject(error);
            }
        });
    }
}

export function rolePopulate() {
    return {
        path: 'role',
        model: RoleModel
    }
}