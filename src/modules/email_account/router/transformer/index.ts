import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { EmailAccount } from "../../entity";

export function emailAccountRawDatumToEmailAccountEntity(emailAccountInfo: any) {
    let emailAccount = new EmailAccount();

    if (emailAccountInfo === null) {
        return emailAccount = null;
    }

    if (emailAccountInfo.id) {
        emailAccount.id = emailAccountInfo.id;
    }

    if (emailAccountInfo.user) {
        emailAccount.user = userRawDatumToUserEntity(emailAccountInfo.user);
    }

    if (emailAccountInfo.email) {
        emailAccount.email = emailAccountInfo.email;
    }

    if (emailAccountInfo.refreshToken) {
        emailAccount.refreshToken = emailAccountInfo.refreshToken;
    }

    if (emailAccountInfo.accessToken) {
        emailAccount.accessToken = emailAccountInfo.accessToken;
    }

    return emailAccount;
}

export function emailAccountsRawDataToEmailAccountsEntities(emailAccountsInfo: any[]): EmailAccount[] {
    if (!emailAccountsInfo || emailAccountsInfo.length === 0) {
        return [];
    }

    return emailAccountsInfo.map(emailAccountRawDatumToEmailAccountEntity);
}