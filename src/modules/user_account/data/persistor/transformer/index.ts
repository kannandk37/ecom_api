import { userEntityToUserRecord, userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { UserAccount } from "../../../entity";
import { ObjectId } from "mongodb";

export function userAccountRecordToUserAccountEntity(userAccountRecord: any): UserAccount {
    let userAccount = new UserAccount();

    if (userAccountRecord === null) {
        return userAccount = null;
    };

    if (userAccountRecord._id) {
        userAccount.id = userAccountRecord._id.toString();
    }

    if (userAccountRecord.user) {
        userAccount.user = userRecordToUserEntity(userAccountRecord.user);
    }

    if (userAccountRecord.email) {
        userAccount.email = userAccountRecord.email;
    }

    if (userAccountRecord.conformationCode) {
        userAccount.conformationCode = userAccountRecord.conformationCode;
    }

    if (userAccountRecord.resetConfirmationCode) {
        userAccount.resetConfirmationCode = userAccountRecord.resetConfirmationCode;
    }

    if (userAccountRecord.password) {
        userAccount.password = userAccountRecord.password;
    }
    if (userAccount.resetConfirmationCode) {
        userAccount.resetConfirmationCode = userAccountRecord.resetConfirmationCode;
    }

    if (userAccountRecord.passwordResetedOn) {
        userAccount.passwordResetedOn = userAccountRecord.passwordResetedOn;
    }

    if (userAccountRecord.status) {
        userAccount.status = userAccountRecord.status;
    }
    return userAccount;
};

export function userAccountEntityToUserAccountRecord(userAccount: UserAccount): object {
    let record: any = {};

    if (userAccount === null) {
        return record = null;
    }

    if (userAccount.id) {
        record._id = new ObjectId(userAccount.id);
    }

    if (userAccount.user?.id) {
        record.user = new ObjectId(userAccount.user.id);
    }

    if (userAccount.email) {
        record.email = userAccount.email;
    }

    if (userAccount.status) {
        record.status = userAccount.status;
    }

    if (userAccount.conformationCode) {
        record.conformationCode = userAccount.conformationCode;
    }

    if (userAccount.resetConfirmationCode) {
        record.resetConfirmationCode = userAccount.resetConfirmationCode;
    }

    if (userAccount.password) {
        record.password = userAccount.password;
    }

    if (userAccount.passwordResetedOn) {
        record.passwordResetedOn = userAccount.passwordResetedOn;
    }

    return record;
}

export function userAccountRecordsToUserAccountEntities(userAccountRecords: any[]): UserAccount[] {
    let userAccounts: UserAccount[] = [];
    userAccountRecords.forEach(element => {
        let userAccount = userAccountRecordToUserAccountEntity(element)
        userAccounts.push(userAccount)
    });
    return userAccounts
}

export function userAccountEntitiesToUserAccountRecords(userAccounts: UserAccount[]): object[] {
    let records: any[] = [];
    userAccounts.forEach(element => {
        let record = userAccountEntityToUserAccountRecord(element)
        records.push(record)
    });
    return records
}