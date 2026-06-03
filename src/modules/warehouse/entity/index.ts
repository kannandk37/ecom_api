import { Address } from "../../address/entity";
import { Profile } from "../../profile/entity";
import { WarehouseBin } from "../../warehouse_bin/entity";

export enum WarehouseType {
    OWN = 'own',
    RENTED = 'rented'
}

export enum WarehouseStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    MAINTENANCE = 'maintenance'
}

export enum CapacityUnit {
    UNITS = 'units',
    // CUBIC_METERS = 'cubic_meters',
    // PALLETS = 'pallets'
}

export class Warehouse {
    id?: string;
    code?: string;
    name?: string;
    type?: WarehouseType;
    status?: WarehouseStatus;
    address?: Address;
    totalCapacity?: number;
    capacityUnit?: CapacityUnit;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    operator?: Profile;

    // only for data fetching on relationship
    warehouseBins?: WarehouseBin[]
}