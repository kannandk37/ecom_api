import { rolesRawDataToRolesEntities } from "../../../role/router/transformer";
import { User } from "../../entity";

export function userRawDatumToUserEntity(raw: any): User {
    let user = new User();

    if (raw === null) {
        return user = null;
    }

    if (raw.id) {
        user.id = raw.id;
    }

    if (raw.roles && raw.roles.length > 0) {
        user.roles = rolesRawDataToRolesEntities(raw.roles);
    }

    return user;

}

export function usersRawDataToUsersEntities(raws: any[]): User[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(userRawDatumToUserEntity);
}