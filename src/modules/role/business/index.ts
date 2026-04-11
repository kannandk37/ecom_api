import { Role } from "../entity";
import { RolePersistor } from "../data/persistor";

export class RoleManagement {

    async getRoles() {
        return new Promise<Role[]>(async (resolve, reject) => {
            try {
                let rolePeristor = new RolePersistor();
                resolve(await rolePeristor.getRoles());
            } catch (error) {
                reject(error);
            }
        });
    }

    async createOrUpdateRole(role: Role) {
        return new Promise<Role>(async (resolve, reject) => {
            try {
                let rolePeristor = new RolePersistor();
                resolve(await rolePeristor.createOrUpdateRole(role));
            } catch (error) {
                reject(error);
            }
        });
    }

    async getRoleByName(name: string) {
        return new Promise<Role>(async (resolve, reject) => {
            try {
                let rolePeristor = new RolePersistor();
                resolve(await rolePeristor.getRoleByName(name));
            } catch (error) {
                reject(error);
            }
        });
    }
}