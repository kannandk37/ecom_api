import { rolesEntitiesToRolesRecords, rolesRecordsToRolesEntities } from "../../../../role/data/persistor/transformer";
import { User } from "../../../entity"
import { ObjectId } from "mongodb";

export function userRecordToUserEntity(userRecord: any) {
    let user = new User()
    if (userRecord === null) {
        return user = null;
    }
    if (userRecord._id) {
        user.id = userRecord._id?.toString();
    }

    if (userRecord.roles?.length > 0) {
        user.roles = rolesRecordsToRolesEntities(userRecord.roles);
    }

    return user;
}

export function userEntityToUserRecord(user: User) {
    let record: any = {};

    if (user === null) {
        return record = null;
    }

    if (user.id) {
        record._id = new ObjectId(user.id);
    }

    if (user.roles && user.roles.length > 0) {
        record.roles = user.roles.map((item) => new ObjectId(item.id));
    }

    return record;
}

export function usersRecordsToUsersEntities(userRecords: any[]) {
    let users: User[] = [];
    userRecords.forEach(element => {
        let user = userRecordToUserEntity(element)
        users.push(user)
    });
    return users
}

export function usersEntitiesToUsersRecords(users: User[]) {
    let records: any[] = [];
    users.forEach(user => {
        let record = userEntityToUserRecord(user);
        records.push(record);
    });
    return records;
}