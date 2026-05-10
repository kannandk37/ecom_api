import { userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { ObjectId } from "mongodb";
import { EmailAccount } from "../../../entity";

export function emailAccountRecordToEmailAccountEntity(emailAccountRecord: any): EmailAccount {
    let emailAccount = new EmailAccount();

    if (emailAccountRecord === null) {
        return emailAccount = null;
    };

    if (emailAccountRecord._id) {
        emailAccount.id = emailAccountRecord._id.toString();
    }

    if (emailAccountRecord.user) {
        emailAccount.user = userRecordToUserEntity(emailAccountRecord.user);
    }

    if (emailAccountRecord.email) {
        emailAccount.email = emailAccountRecord.email;
    }

    if (emailAccountRecord.refreshToken) {
        emailAccount.refreshToken = emailAccountRecord.refreshToken;
    }

    if (emailAccountRecord.accessToken) {
        emailAccount.accessToken = emailAccountRecord.accessToken;
    }

    return emailAccount;
};

export function emailAccountEntityToEmailAccountRecord(emailAccount: EmailAccount): any {
    let record: any = {};

    if (emailAccount === null) {
        return record = null;
    }

    if (emailAccount.id) {
        record._id = new ObjectId(emailAccount.id);
    }

    if (emailAccount.user?.id) {
        record.user = new ObjectId(emailAccount.user.id);
    }

    if (emailAccount.email) {
        record.email = emailAccount.email;
    }

    if (emailAccount.refreshToken) {
        record.refreshToken = emailAccount.refreshToken;
    }

    if (emailAccount.accessToken) {
        record.accessToken = emailAccount.accessToken;
    }

    return record;
}

export function emailAccountRecordsToEmailAccountEntities(emailAccountRecords: any[]): EmailAccount[] {
    let emailAccounts: EmailAccount[] = [];
    emailAccountRecords.forEach(element => {
        let emailAccount = emailAccountRecordToEmailAccountEntity(element)
        emailAccounts.push(emailAccount)
    });
    return emailAccounts
}

export function emailAccountEntitiesToEmailAccountRecords(emailAccounts: EmailAccount[]): any[] {
    let records: any[] = [];
    emailAccounts.forEach(element => {
        let record = emailAccountEntityToEmailAccountRecord(element)
        records.push(record)
    });
    return records
}