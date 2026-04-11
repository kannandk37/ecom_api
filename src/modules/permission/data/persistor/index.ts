import { Permission } from "../../entity";
import { PermissionModel } from "../schema";
import { permissionEntityToPermissionsRecord, permissionRecordToPermissionsEntity } from "./transformer";

export class PermissionPersistor {
    async persistPermission(permission: Permission): Promise<Permission> {
        return new Promise(async (resolve, reject) => {
            try {
                let permissionRecord = permissionEntityToPermissionsRecord(permission);
                let createdPermissionRecord = await PermissionModel.create(permissionRecord);
                resolve(permissionRecordToPermissionsEntity(createdPermissionRecord));
            } catch (error) {
                reject(error);
            }
        });
    }

    async getPermissionByKey(key: string): Promise<Permission | null> {
        return new Promise(async (resolve, reject) => {
            try {
                let permissionRecord = await PermissionModel.findOne({ key });
                resolve(permissionRecord ? permissionRecordToPermissionsEntity(permissionRecord) : null);
            } catch (error) {
                reject(error);
            }
        });
    }
}