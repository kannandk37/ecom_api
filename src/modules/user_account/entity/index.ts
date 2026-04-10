import { User } from "../../user/entity"

export enum AccountStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    DELETED = 'deleted'
}
export class UserAccount {
    id?: string
    user: User
    accountIdentifier?: string
    status?: AccountStatus
    conformationCode?: string | null
    resetConfirmationCode?: string | null
    password?: string
    passwordResetedOn?: Date

    constructor(
        user: User,
        accountIdentifier?: string,
        status?: AccountStatus,
        conformationCode?: string,
        resetConfirmationCode?: string,
        password?: string,
        passwordResetedOn?: Date
    ) {
        this.user = user
        this.accountIdentifier = accountIdentifier
        this.status = status
        this.conformationCode = conformationCode
        this.resetConfirmationCode = resetConfirmationCode
        this.password = password
        this.passwordResetedOn = passwordResetedOn
    }
}