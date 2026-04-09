export class Permission {
    id?: string; // e.g., "prod_create", "user_delete"
    name?: string; // e.g., "Create Product", "Delete User"
    description?: string;
    module?: string; // e.g., "Catalog", "Billing", "Users"

    // Added Attributes for functional logic

    action?: 'create' | 'read' | 'update' | 'delete' | 'manage';
    // Description -> Essential for code-level checks (e.g., if(perm.action === 'delete')).

    slug?: string;
    // Description -> A unique, machine-readable string (e.g., "catalog:product:write") 
    // used in the frontend/backend logic to toggle UI elements or API access.

    isActive?: boolean;
    // Description -> Allows an admin to globally disable a specific feature's permission 
    // without deleting the record or reconfiguring every Role.
}