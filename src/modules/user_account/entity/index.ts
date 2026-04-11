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
    user?: User
    email?: string
    status?: AccountStatus
    conformationCode?: string
    resetConfirmationCode?: string
    password?: string
    passwordResetedOn?: Date
}