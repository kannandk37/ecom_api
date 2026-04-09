import { User } from "../../user/entity"

export enum AccountStatus {
    PENDING = 'pending',
    ACTIVE = 'active'
}


export class UserAccount {
    id?: string
    user: User
    accountIdentifier?: string
    status?: AccountStatus
    conformationCode?: string
    resetConfirmationCode?: string
    password?: string

    constructor(
        user: User,
        accountIdentifier?: string,
        status?: AccountStatus,
        conformationCode?: string,
        resetConfirmationCode?: string,
        password?: string,
    ) {
        this.user = user
        this.accountIdentifier = accountIdentifier
        this.status = status
        this.conformationCode = conformationCode
        this.resetConfirmationCode = resetConfirmationCode
        this.password = password
    }
}