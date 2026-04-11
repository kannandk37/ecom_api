import { Permission, PermissionActions, PermissionResources } from "../../../entity";
import { ObjectId } from "mongodb";

export function permissionRecordToPermissionsEntity(permissionRecord: any): Permission {
    let permission = new Permission();

    if (permissionRecord === null) {
        return permission = null;
    }

    if (permissionRecord._id) {
        permission.id = permissionRecord._id?.toString();
    }

    if (permissionRecord.resource) {
        permission.resource = permissionRecord.resource as PermissionResources;
    }

    if (permissionRecord.action) {
        permission.action = permissionRecord.action as PermissionActions;
    }

    if (permissionRecord.key) {
        permission.key = permissionRecord.key as `${PermissionResources}.${PermissionActions}`;
    }

    if (permissionRecord.description) {
        permission.description = permissionRecord.description;
    }

    if (permissionRecord.isActive !== undefined) {
        permission.isActive = permissionRecord.isActive;
    }

    return permission;
}

export function permissionEntityToPermissionsRecord(permission: Permission) {
    let record: any = {};

    if (permission === null) {
        return record = null;
    }

    if (permission.id) {
        record._id = new ObjectId(permission.id);
    }

    if (permission.description) {
        record.description = permission.description;
    }

    if (permission.key) {
        record.key = permission.key;
    }

    if (permission.resource) {
        record.resource = permission.resource;
    }

    if (permission.action) {
        record.action = permission.action;
    }

    if (permission.isActive !== undefined) {
        record.isActive = permission.isActive;
    }

    return record;
}

export function permissionRecordsToPermissionEntities(permissionRecords: any[]): Permission[] {
    if (!permissionRecords || permissionRecords.length === 0) {
        return [];
    }
    return permissionRecords.map((record) => permissionRecordToPermissionsEntity(record));
}

export function permissionEntitiesToPermissionRecords(permissions: Permission[]): object[] {
    if (!permissions || permissions.length === 0) {
        return [];
    }
    return permissions.map((permission) => permissionEntityToPermissionsRecord(permission));
}