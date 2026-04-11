import { Permission, PermissionActions, PermissionResources } from "../../entity";

export function permissionRawDatumToPermissionsEntity(raw: any): Permission {
    let permission = new Permission();

    if (raw === null) {
        return permission = null;
    }

    if (raw.resource) {
        permission.resource = raw.resource as PermissionResources;
    }

    if (raw.action) {
        permission.action = raw.action as PermissionActions;
    }

    if (raw.key) {
        permission.key = raw.key as `${PermissionResources}.${PermissionActions}`;
    }

    if (raw.description) {
        permission.description = raw.description;
    }

    permission.isActive = true;

    return permission;
}

export function permissionsRawDataToPermissionsEntities(raws: any[]): Permission[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map((raw) => permissionRawDatumToPermissionsEntity(raw));
}