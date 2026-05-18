import { WarehouseBin } from "../../warehouse_bin/entity";
import { Inventory } from "../../inventory/entity";
import { Product } from "../../product/entity";
import { Variant } from "../../variant/entity";
import { DateTime } from "luxon";

export class BinStock {
    id?: string;
    bin?: WarehouseBin;
    product?: Product;
    variant?: Variant;
    inventory?: Inventory;
    qtyOnHand?: number;
    batchNumber?: string;
    expiryDate?: DateTime;
    lastCountedAt?: DateTime;
}