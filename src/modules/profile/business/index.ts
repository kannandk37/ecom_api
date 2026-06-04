import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { Profile } from "../entity";
import { ProfilePersistor } from "../data/persistor";
import { Role, RoleName } from "../../role/entity";
import { RoleManagement } from "../../role/business";

export class ProfileManagement {
    async createProfile(profile: Profile, transaction?: any): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                let profilePersisitor = new ProfilePersistor();
                let validateEmail = await this.validateProfileEmail(profile);
                if (!validateEmail) {
                    return reject(
                        new ApiError("Profile Email already exists", StatusCodes.BAD_REQUEST, true)
                    );
                }
                let validateMobile = await this.validateProfileMobile(profile);
                if (!validateMobile) {
                    return reject(
                        new ApiError("Profile Mobile Number already exists", StatusCodes.BAD_REQUEST, true)
                    );
                }
                let profileRecord = await profilePersisitor.persistProfile(profile, transaction);
                resolve(profileRecord);
            } catch (error) {
                reject(error);
            }
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

    async validateProfileMobile(profile: Profile) {
        return new Promise(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                let existingProfile = await profilePersistor.profileByMobile(
                    profile.mobile
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

    async profileByEmail(email: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profileByEmail(email));
            } catch (error) {
                reject(error);
            }
        })
    }

    async profileByUserId(userId: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profileByUserId(userId));
            } catch (error) {
                reject(error);
            }
        })
    }

    async profileByUserIdAndRoleId(userId: string, roleId: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profileByUserIdAndRoleId(userId, roleId));
            } catch (error) {
                reject(error);
            }
        })
    }

    async profileById(id: string): Promise<Profile> {
        return new Promise<Profile>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profileById(id));
            } catch (error) {
                reject(error);
            }
        })
    }

    async profilesByRoles(rolesNames: RoleName[]): Promise<Profile[]> {
        return new Promise<Profile[]>(async (resolve, reject) => {
            try {
                let roles = await new RoleManagement().getRolesByNames(rolesNames);
                if (roles?.length > 0) {
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

    async profiles(): Promise<Profile[]> {
        return new Promise<Profile[]>(async (resolve, reject) => {
            try {
                let profilePersistor = new ProfilePersistor();
                resolve(await profilePersistor.profiles());
            } catch (error) {
                reject(error);
            }
        })
    }
}