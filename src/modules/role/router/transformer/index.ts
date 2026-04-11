import { permissionsRawDataToPermissionsEntities } from "../../../permission/router/transformer";
import { Role } from "../../entity";

export function roleRawDatumToRoleEntity(raw: any): Role {
    let role = new Role();

    if (raw === null) {
        return role = null;
    }

    if (raw.id) {
        role.id = raw.id;
    }

    if (raw.name) {
        role.name = raw.name;
    }

    if (raw.permissions) {
        role.permissions = permissionsRawDataToPermissionsEntities(raw.permissions);
    }

    if (raw.description) {
        role.description = raw.description;
    }

    if (raw.isSystemRole !== undefined) {
        role.isSystemRole = raw.isSystemRole;
    }

    return role;
}

export function rolesRawDataToRolesEntities(raws: any[]): Role[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(roleRawDatumToRoleEntity);
}