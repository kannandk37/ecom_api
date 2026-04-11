import { roleRawDatumToRoleEntity } from "../../../role/router/transformer";
import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { Profile } from "../../entity";

export function profileRawDatumToProfileEntity(raw: any): Profile {
    let profile = new Profile();

    if (raw === null) {
        return profile = null;
    }

    if (raw.id) {
        profile.id = raw.id;
    }

    if (raw.user) {
        profile.user = userRawDatumToUserEntity(raw.user);
    }

    if (raw.name) {
        profile.name = raw.name;
    }

    if (raw.email) {
        profile.email = raw.email;
    }

    if (raw.mobile) {
        profile.mobile = raw.mobile;
    }

    if (raw.role) {
        profile.role = roleRawDatumToRoleEntity(raw.role);
    }

    if (raw.profilePic) {
        profile.profilePic = raw.profilePic;
    }

    if (raw.isEmailVerified !== undefined) {
        profile.isEmailVerified = raw.isEmailVerified;
    }

    if (raw.lastLogin) {
        profile.lastLogin = new Date(raw.lastLogin);
    }

    return profile;
}

export function profilesRawDataToProfilesEntities(raws: any[]): Profile[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map((raw) => profileRawDatumToProfileEntity(raw));
}