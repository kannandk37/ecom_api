import { addressRecordToAddressEntity } from "../../../../address/data/persistor/transformer";
import { userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { Warehouse } from "../../../entity";
import { ObjectId } from "mongodb";

export function warehouseRecordToWarehouseEntity(warehouseRecord: any): Warehouse {
    let warehouse = new Warehouse();

    if (warehouseRecord === null || warehouseRecord === undefined) {
        return warehouse = null;
    }

    if (warehouseRecord._id) {
        warehouse.id = warehouseRecord._id?.toString();
    }

    if (warehouseRecord.code) {
        warehouse.code = warehouseRecord.code;
    }

    if (warehouseRecord.name) {
        warehouse.name = warehouseRecord.name;
    }

    if (warehouseRecord.type) {
        warehouse.type = warehouseRecord.type;
    }

    if (warehouseRecord.status) {
        warehouse.status = warehouseRecord.status;
    }

    if (warehouseRecord.address) {
        warehouse.address = addressRecordToAddressEntity(warehouseRecord.address);
    }

    if (warehouseRecord.totalCapacity !== undefined) {
        warehouse.totalCapacity = warehouseRecord.totalCapacity;
    }

    if (warehouseRecord.capacityUnit) {
        warehouse.capacityUnit = warehouseRecord.capacityUnit;
    }

    if (warehouseRecord.operator) {
        warehouse.operator = userRecordToUserEntity(warehouseRecord.operator);
    }

    if (warehouseRecord.createdAt) {
        warehouse.createdAt = warehouseRecord.createdAt;
    }

    if (warehouseRecord.updatedAt) {
        warehouse.updatedAt = warehouseRecord.updatedAt;
    }

    return warehouse;
}

export function warehouseEntityToWarehouseRecord(warehouse: Warehouse): object {
    let record: any = {};

    if (warehouse === null || warehouse === undefined) {
        return record = null;
    }

    if (warehouse.id) {
        record._id = new ObjectId(warehouse.id);
    }

    if (warehouse.code) {
        record.code = warehouse.code;
    }

    if (warehouse.name) {
        record.name = warehouse.name;
    }

    if (warehouse.type) {
        record.type = warehouse.type;
    }

    if (warehouse.status) {
        record.status = warehouse.status;
    }

    if (warehouse.address) {
        record.address = new ObjectId(warehouse.address.id)
    }

    if (warehouse.totalCapacity !== undefined) {
        record.totalCapacity = warehouse.totalCapacity;
    }

    if (warehouse.capacityUnit) {
        record.capacityUnit = warehouse.capacityUnit;
    }

    if (warehouse.operator) {
        record.operator = new ObjectId(warehouse.operator.id)
    }

    return record;
}

export function warehousesRecordsToWarehousesEntities(warehouseRecords: any[]): Warehouse[] {
    if (!warehouseRecords || warehouseRecords.length === 0) {
        return [];
    }
    return warehouseRecords.map((record) => warehouseRecordToWarehouseEntity(record));
}

export function warehousesEntitiesToWarehousesRecords(warehouses: Warehouse[]): object[] {
    if (!warehouses || warehouses.length === 0) {
        return [];
    }
    return warehouses.map((warehouse) => warehouseEntityToWarehouseRecord(warehouse));
}