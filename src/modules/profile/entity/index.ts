import { Role } from "../../role/entity";
import { User } from "../../user/entity";

export class Profile {
    id?: string;
    user?: User;
    name?: string;
    email?: string;
    password?: string; // Hashed password
    mobile?: string;
    role?: Role;
    profilePic?: string;
    isEmailVerified?: boolean; // Vital for security and account recovery
    lastLogin?: Date; // Important for security auditing and user engagement tracking
}