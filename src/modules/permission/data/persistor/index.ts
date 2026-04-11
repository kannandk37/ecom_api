import { Permission } from "../../entity";
import { PermissionModel } from "../schema";
import { permissionEntityToPermissionRecord, permissionRecordToPermissionEntity, permissionsRecordsToPermissionsEntities } from "./transformer";

export class PermissionPersistor {
    async persistPermission(permission: Permission): Promise<Permission> {
        return new Promise(async (resolve, reject) => {
            try {
                let permissionRecord = permissionEntityToPermissionRecord(permission);
                let createdPermissionRecord = await PermissionModel.create(permissionRecord);
                resolve(permissionRecordToPermissionEntity(createdPermissionRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async getPermissionByKey(key: string): Promise<Permission | null> {
        return new Promise<Permission>(async (resolve, reject) => {
            try {
                let permissionRecord = await PermissionModel.findOne({ key });
                resolve(permissionRecord ? permissionRecordToPermissionEntity(permissionRecord) : null);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getPermissionsByKeys(keys: string[]): Promise<Permission[]> {
        return new Promise<Permission[]>(async (resolve, reject) => {
            try {
                let permissionsRecords = await PermissionModel.find({ key: { $in: keys } });
                resolve(permissionsRecordsToPermissionsEntities(permissionsRecords));
            } catch (error) {
                reject(error);
            }
        });
    }
}