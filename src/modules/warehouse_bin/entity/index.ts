import { Warehouse } from "../../warehouse/entity";

export class WarehouseBin {
    id?: string;
    warehouse?: Warehouse;
    binCode?: string;
    aisle?: string;
    rack?: string;
    level?: string;
    position?: string;
    maxUnits?: number;
    isActive?: boolean;
}