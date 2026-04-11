import { roleEntityToRoleRecord, roleRecordToRoleEntity } from "../../../../role/data/persistor/transformer";
import { userEntityToUserRecord, userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { Profile } from "../../../entity";
import { ObjectId } from "mongodb";

export function profileRecordToProfileEntity(profileRecord: any) {
    let profile = new Profile();

    if (profileRecord === null) {
        return profile = null;
    };
    if (profileRecord._id) {
        profile.id = profileRecord._id?.toString();
    }

    if (profileRecord.user) {
        profile.user = userRecordToUserEntity(profileRecord.user);
    }

    if (profile.name) {
        profile.name = profileRecord.name;
    }

    if (profileRecord.email) {
        profile.email = profileRecord.email;
    }

    if (profileRecord.mobile) {
        profile.mobile = profileRecord.mobile;
    };

    if (profileRecord.role) {
        profile.role = roleRecordToRoleEntity(profileRecord.role);
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

export function profileEntityToProfileRecord(profile: Profile) {
    let record: any = {};

    if (profile === null) {
        return record = null;
    }

    if (profile.id) {
        record._id = new ObjectId(profile.id);
    }

    if (profile.user?.id) {
        record.user = new ObjectId(profile.user.id);
    }

    if (profile.name) {
        record.name = profile.name;
    }

    if (profile.email) {
        record.email = profile.email;
    }

    if (profile.mobile) {
        record.mobile = profile.mobile;
    }

    if (profile.role?.id) {
        record.role = new ObjectId(profile.role.id);
    }

    if (profile.profilePic) {
        record.profilePic = profile.profilePic;
    }

    if (profile.isEmailVerified) {
        record.isEmailVerified = profile.isEmailVerified;
    }

    if (profile.lastLogin) {
        record.lastLogin = profile.lastLogin;
    }
    return record;
}

export function profilesRecordsToprofilesEntities(profileRecords: any[]): Profile[] {
    if (!profileRecords || profileRecords.length === 0) {
        return [];
    }
    return profileRecords.map((record) => profileRecordToProfileEntity(record));
}

export function profilesEntitiesToProfilesRecords(profiles: Profile[]): object[] {
    if (!profiles || profiles.length === 0) {
        return [];
    }
    return profiles.map((profile) => profileEntityToProfileRecord(profile));
}