import { Role } from "../../../../role/entity";
import { User } from "../../../../user/entity";
import { Profile } from "../../../entity";

export function profileRecordToProfileEntity(profileRecord: any) {
    let profile = new Profile();
    if (profileRecord === null) {
        return profile;
    };
    if (profileRecord._id) {
        profile.id = profileRecord._id?.toString();
    }

    if (profileRecord.mobileNumber) {
        profile.mobile = profileRecord.mobile;
    };

    if (profile.name) {
        profile.name = profileRecord.name;
    }

    if (profileRecord.email) {
        profile.email = profileRecord.email;
    }
    if (profileRecord.role) {
        let role = new Role();
        role.id = profileRecord.role?._id?.toString();
        profile.role = role;
    }

    if (profileRecord.user) {
        let user = new User();
        user.id = profileRecord.user?._id?.toString();
        profile.user = user;
    }

    if (profileRecord.profilePic) {
        profile.profilePic = profileRecord.profilePic;
    }

    if (profileRecord.isEmailVerified) {
        profile.isEmailVerified = profileRecord.isEmailVerified;
    }

    if (profileRecord.lastLogin) {
        profile.lastLogin = profileRecord.lastLogin;
    }

    return profile;
}
