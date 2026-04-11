import { permissionsRecordsToPermissionsEntities } from "../../../../permission/data/persistor/transformer";
import { Role, RoleName } from "../../../entity";
import { ObjectId } from "mongodb";

export function roleRecordToRoleEntity(roleRecord: any): Role {
    let role = new Role();

    if (roleRecord === null) {
        return role = null;
    }

    if (roleRecord._id) {
        role.id = roleRecord._id?.toString();
    }

    if (roleRecord.name) {
        role.name = roleRecord.name as RoleName;
    }

    if (roleRecord.description) {
        role.description = roleRecord.description;
    }

    if (roleRecord.permissions && roleRecord.permissions.length > 0) {
        role.permissions = permissionsRecordsToPermissionsEntities(roleRecord.permissions);
    }

    if (roleRecord.isSystemRole !== undefined) {
        role.isSystemRole = roleRecord.isSystemRole;
    }

    return role;
}

export function roleEntityToRoleRecord(role: Role): any {
    let record: any = {};

    if (role === null) {
        return record = null;
    }

    if (role.id) {
        record._id = new ObjectId(role.id);
    }

    if (role.name) {
        record.name = role.name;
    }

    if (role.description) {
        record.description = role.description;
    }

    if (role.permissions && role.permissions.length > 0) {
        record.permissions = role.permissions.map((item) => new ObjectId(item.id));
    }

    if (role.isSystemRole !== undefined) {
        record.isSystemRole = role.isSystemRole;
    }

    return record;
}

export function rolesRecordsToRolesEntities(roleRecords: any[]): Role[] {
    if (!roleRecords || roleRecords.length === 0) {
        return [];
    }
    return roleRecords.map((record) => roleRecordToRoleEntity(record));
}

export function rolesEntitiesToRolesRecords(roles: Role[]): object[] {
    if (!roles || roles.length === 0) {
        return [];
    }
    return roles.map((role) => roleEntityToRoleRecord(role));
}