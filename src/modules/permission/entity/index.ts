export enum PermissionActions {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

export enum PermissionResources {
    CATEGORY = 'category',
    BRAND = 'brand',
    PRODUCT = 'product',
    VARIANT = 'variant',
    ORDER = 'order',
    ORDER_ITEM = 'orderitem',
    INVOICE = 'invoice',
    INVOICE_ITEM = 'invoiceitem',
    PAYMENT = 'payment',
    ADDRESS = 'address',
    DELIVERY = 'delivery',
    WAREHOUSE = 'warehouse',
    USER = 'user',
    USER_ACCOUNT = 'useraccount'
}
export class Permission {
    id?: string;
    description?: string;
    key?: `${PermissionResources}.${PermissionActions}`; // e.g., "catalog.create", "billing.read", "users.update"
    resource?: PermissionResources; // e.g., "Catalog", "Billing", "Users"
    action?: PermissionActions;
    isActive?: boolean;
}