import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { Profile } from "../entity";
import { ProfilePersistor } from "../data/persistor";

export class ProfileManagement {
    async createProfile(profile: Profile, transaction?: any): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            let profilePersisitor = new ProfilePersistor();
            let validateEmail = await this.validateProfileEmail(profile);
            if (!validateEmail) {
                return reject(
                    new ApiError("Profile email already exists", StatusCodes.BAD_REQUEST)
                );
            }
            let profileRecord = await profilePersisitor.persistProfile(profile, transaction);
            resolve(profileRecord);
        });
    }


    async validateProfileEmail(profile: Profile) {
        return new Promise(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                let existingProfile = await profilePersistor.profileByEmail(
                    profile.email
                );
                if (existingProfile) {
                    return resolve(false);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}