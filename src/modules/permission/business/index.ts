import { PermissionPersistor } from "../data/persistor";
import { Permission } from "../entity";

export class PermissionManagement {
    async createPermission(permission: Permission): Promise<Permission> {
        return new Promise(async (resolve, reject) => {
            try {
                let permissionPersistor = new PermissionPersistor();
                resolve(await permissionPersistor.persistPermission(permission))
            } catch (error) {
                reject(error)
            }
        });
    }

    async getPermissionByKey(key: string): Promise<Permission | null> {
        return new Promise(async (resolve, reject) => {
            try {
                let permissionPersistor = new PermissionPersistor();
                resolve(await permissionPersistor.getPermissionByKey(key))
            } catch (error) {
                reject(error)
            }
        });
    }
}