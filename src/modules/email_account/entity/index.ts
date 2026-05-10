import { User } from "../../user/entity";

export class EmailAccount {
    id?: string;
    user?: User;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
}