import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { Profile } from "../entity";
import { ProfilePersistor } from "../data/persistor";
import { Role, RoleName } from "../../role/entity";
import { RoleManagement } from "../../role/business";

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

    async profileByEmail(email: string) {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profileByEmail(email));
            } catch (error) {
                reject(error);
            }
        })
    }

    async profileByUserId(userId: string) {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profileByUserId(userId));
            } catch (error) {
                reject(error);
            }
        })
    }

    async profilesByRoles(rolesNames: RoleName[]) {
        return new Promise<Profile[]>(async (resolve, reject) => {
            try {
                let roles = await new RoleManagement().getRolesByNames(rolesNames);
                if(roles?.length > 0) {   
                    let profilePersistor = new ProfilePersistor();
                    resolve(await profilePersistor.profileByRoleIds(roles?.map((el: Role) => el.id)));
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}