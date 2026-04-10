import { UserAccount } from "../../entity";

export function userAccountInfoToUserAccountEntity(userAccountInfo: any) {
    let userAccount = new UserAccount(null);
    if (userAccountInfo.id) {
        userAccount.id = userAccountInfo.id;
    }

    if (userAccountInfo.user) {
        userAccount.user = userAccountInfo.user;
    }

    if (userAccountInfo.accountIdentifier) {
        userAccount.accountIdentifier = userAccountInfo.accountIdentifier;
    }

    if (userAccountInfo.status) {
        userAccount.status = userAccountInfo.status;
    }

    if (userAccountInfo.conformationCode) {
        userAccount.conformationCode = userAccountInfo.conformationCode;
    }

    if (userAccountInfo.resetConfirmationCode) {
        userAccount.resetConfirmationCode = userAccountInfo.resetConfirmationCode;
    }

    if (userAccountInfo.password) {
        userAccount.password = userAccountInfo.password;
    }

    if (userAccountInfo.passwordResetedOn) {
        userAccount.passwordResetedOn = userAccountInfo.passwordResetedOn; // need to convert to utc date format
    }

    return userAccount;
}