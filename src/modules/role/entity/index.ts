import { Permission } from "../../permission/entity";

export class Role {
    id?: string;
    name?: string;
    permissions?: Permission[];

    // Added:
    description?: string; // To help admins understand what this role is intended for.
    isSystemRole?: boolean; // Protects core roles (like 'Super Admin') from being deleted.
}