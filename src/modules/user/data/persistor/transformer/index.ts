import { User } from "../../../entity"

export function userRecordsToUserEntities(userRecords: any[]) {
    let users: User[] = [];
    userRecords.forEach(element => {
        let user = userRecordTouserEntity(element)
        users.push(user)
    });
    return users
}

export function userRecordTouserEntity(userRecord: any) {
    let user = new User()
    if (userRecord._id) {
        user.id = userRecord._id?.toString();
    }

    if (userRecord.roles?.length > 0) {
        user.roles = userRecord.roles?.map((role: any) => {
            let roleEntity = {
                id: role._id?.toString(),
                name: role.name,
                permissions: role.permissions,
                description: role.description,
                isSystemRole: role.isSystemRole
            }
            return roleEntity;
        })
    }

    return user;
}