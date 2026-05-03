import { Address } from "../../address/entity";
import { User } from "../../user/entity";

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
    CUBIC_METERS = 'cubic_meters',
    PALLETS = 'pallets'
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
    createdAt?: Date;
    updatedAt?: Date;
    operator?: User;
}