import { ProfilePersistor } from "../../profile/data/persistor";
import { UserPersistor } from "../data/persistor";
import { User } from "../entity";

export class UserManagement {
    async createUser(user: User, transaction?: any): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let userPersistor = new UserPersistor();
                resolve(await userPersistor.persistUser(user, transaction))
            } catch (error) {
                reject(error)
            }
        });
    }

    async userById(id: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let userPersistor = new UserPersistor();
                let user = await userPersistor.userById(id)
                let profilePersistor = new ProfilePersistor();
                let profile = await profilePersistor.profileByUserId(id);
                let result = {
                    id: user.id,
                    user: user,
                    profile: profile,
                    roles: user.roles
                };
                resolve(result);
            } catch (error) {
                reject(error)
            }
        });
    }

    async users() {
        return new Promise<User[]>(async (resolve, reject) => {
            try {
                let userPersistor = new UserPersistor();
                resolve(await userPersistor.users());
            } catch (error) {
                reject(error)
            }
        });
    }
}