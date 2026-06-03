import { Inventory } from "../../inventory/entity";
import { Warehouse } from "../../warehouse/entity";
import { WarehouseBin } from "../../warehouse_bin/entity";
import { BinStock } from "../../bin_stock/entity";
import { Profile } from "../../profile/entity";
import { Product } from "../../product/entity";
import { Variant } from "../../variant/entity";

export enum MovementType {
    INBOUND_RECEIVE = 'inbound_receive',
    PICK = 'pick',
    PUTAWAY = 'putaway',
    RETURN_RECEIVE = 'return_receive',
    ADJUSTMENT = 'adjustment',
    TRANSFER_OUT = 'transfer_out',
    TRANSFER_IN = 'transfer_in',
    DAMAGE_WRITE_OFF = 'damage_write_off',
    CYCLE_COUNT_ADJUST = 'cycle_count_adjust'
}

export enum ReferenceType {
    CART_ITEM = 'cart_item',
    ORDER_ITEM = 'order_item',
    PURCHASE_ORDER = 'purchase_order',
    TRANSFER_ORDER = 'transfer_order',
    RETURN = 'return',
    MANUAL_ADJUST = 'manual_adjustment'
}

export class StockLedger {
    id?: string;
    inventory?: Inventory;
    warehouse?: Warehouse;
    bin?: WarehouseBin;
    binStock?: BinStock;
    product?: Product;
    variant?: Variant;
    movementType?: MovementType;
    quantityDelta?: number;
    qtyBefore?: number;
    qtyAfter?: number;
    referenceType?: ReferenceType;
    referenceId?: string;
    notes?: string;
    performedBy?: Profile;
    createdAt?: Date;        // immutable — append-only
}