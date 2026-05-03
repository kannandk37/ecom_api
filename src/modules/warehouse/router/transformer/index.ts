import { addressRawDatumToAddressEntity } from "../../../address/router/transformer";
import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { CapacityUnit, Warehouse, WarehouseStatus, WarehouseType } from "../../entity";

export function warehouseRawDatumToWarehouseEntity(raw: any): Warehouse {
    let warehouse = new Warehouse();

    if (raw === null || raw === undefined) {
        return warehouse = null;
    }

    if (raw.id) {
        warehouse.id = raw.id;
    }

    if (raw.code) {
        warehouse.code = raw.code;
    }

    if (raw.name) {
        warehouse.name = raw.name;
    }

    if (raw.type) {
        warehouse.type = raw.type as WarehouseType;
    }

    if (raw.status) {
        warehouse.status = raw.status as WarehouseStatus;
    }

    if (raw.address) {
        warehouse.address = addressRawDatumToAddressEntity(raw.address);
    }

    if (raw.totalCapacity !== undefined) {
        warehouse.totalCapacity = raw.totalCapacity;
    }

    if (raw.capacityUnit) {
        warehouse.capacityUnit = raw.capacityUnit as CapacityUnit;
    }

    if (raw.operator) {
        warehouse.operator = userRawDatumToUserEntity(raw.operator);
    }

    return warehouse;
}

export function warehouseRawDataToWarehouseEntity(raws: any[]): Warehouse[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(warehouseRawDatumToWarehouseEntity);
}