import { User } from "../../../../user/entity";
import { UserAccount } from "../../../entity";

export function userAccountRecordToUserAccountEntity(userAccountRecord: any): UserAccount {
    let user = new User();
    let userAccount = new UserAccount(user);
    if (userAccountRecord === null) {
        return userAccount;
    };

    if (userAccountRecord._id) {
        userAccount.id = userAccountRecord._id.toString();
    }

    if (userAccountRecord.user) {
        user.id = userAccountRecord.user._id?.toString();
    }
    userAccount.user = user;
    if (userAccountRecord.accountIdentifier) {
        userAccount.accountIdentifier = userAccountRecord.accountIdentifier;
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