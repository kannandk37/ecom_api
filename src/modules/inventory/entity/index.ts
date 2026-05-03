import { Product } from "../../product/entity";
import { Variant } from "../../variant/entity";
import { Warehouse } from "../../warehouse/entity";

export enum ReorderStatus {
    NONE = 'none',
    TRIGGERED = 'triggered',
    RECEIVED = 'received'
}

export class Inventory {
    id?: string;
    product?: Product;
    variant?: Variant;
    warehouse?: Warehouse;
    qtyOnHand?: number;
    qtyReserved?: number;
    qtyCommitted?: number;
    // qtyAvailable    — compute on read: qtyOnHand - qtyReserved - qtyCommitted
    reorderPoint?: number;
    reorderQty?: number;
    reorderOrderedQty?: number;  // qty placed with vendor in reorder phase A — cleared after RECEIVED
    maxStockLevel?: number;
    reorderStatus?: ReorderStatus;
    lastMovementAt?: Date;
    updatedAt?: Date;
}