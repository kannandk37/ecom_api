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

    async getPermissionsByKeys(keys: string[]): Promise<Permission[]> {
        return new Promise<Permission[]>(async (resolve, reject) => {
            try {
                let permissionPersistor = new PermissionPersistor();
                resolve(await permissionPersistor.getPermissionsByKeys(keys))
            } catch (error) {
                reject(error)
            }
        });
    }
}