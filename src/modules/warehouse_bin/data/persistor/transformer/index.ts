import { WarehouseBin } from "../../../entity";
import { warehouseRecordToWarehouseEntity } from "../../../../warehouse/data/persistor/transformer";
import { ObjectId } from "mongodb";

export function warehouseBinRecordToWarehouseBinEntity(warehouseBinRecord: any): WarehouseBin {
    let warehouseBin = new WarehouseBin();

    if (warehouseBinRecord === null || warehouseBinRecord === undefined) {
        return warehouseBin = null;
    }

    if (warehouseBinRecord._id) {
        warehouseBin.id = warehouseBinRecord._id?.toString();
    }

    if (warehouseBinRecord.warehouse) {
        warehouseBin.warehouse = warehouseRecordToWarehouseEntity(warehouseBinRecord.warehouse);
    }

    if (warehouseBinRecord.binCode) {
        warehouseBin.binCode = warehouseBinRecord.binCode;
    }

    if (warehouseBinRecord.aisle) {
        warehouseBin.aisle = warehouseBinRecord.aisle;
    }

    if (warehouseBinRecord.rack) {
        warehouseBin.rack = warehouseBinRecord.rack;
    }

    if (warehouseBinRecord.level) {
        warehouseBin.level = warehouseBinRecord.level;
    }

    if (warehouseBinRecord.position) {
        warehouseBin.position = warehouseBinRecord.position;
    }

    if (warehouseBinRecord.maxUnits !== undefined) {
        warehouseBin.maxUnits = warehouseBinRecord.maxUnits;
    }

    if (warehouseBinRecord.isActive !== undefined) {
        warehouseBin.isActive = warehouseBinRecord.isActive;
    }

    return warehouseBin;
}

export function warehouseBinEntityToWarehouseBinRecord(warehouseBin: WarehouseBin): object {
    let record: any = {};

    if (warehouseBin === null || warehouseBin === undefined) {
        return record = null;
    }

    if (warehouseBin.id) {
        record._id = new ObjectId(warehouseBin.id);
    }

    if (warehouseBin.warehouse?.id) {
        record.warehouse = new ObjectId(warehouseBin.warehouse.id);
    }

    if (warehouseBin.binCode) {
        record.binCode = warehouseBin.binCode;
    }

    if (warehouseBin.aisle) {
        record.aisle = warehouseBin.aisle;
    }

    if (warehouseBin.rack) {
        record.rack = warehouseBin.rack;
    }

    if (warehouseBin.level) {
        record.level = warehouseBin.level;
    }

    if (warehouseBin.position) {
        record.position = warehouseBin.position;
    }

    if (warehouseBin.maxUnits !== undefined) {
        record.maxUnits = warehouseBin.maxUnits;
    }

    if (warehouseBin.isActive !== undefined) {
        record.isActive = warehouseBin.isActive;
    }

    return record;
}

export function warehouseBinsRecordsToWarehouseBinsEntities(warehouseBinRecords: any[]): WarehouseBin[] {
    if (!warehouseBinRecords || warehouseBinRecords.length === 0) {
        return [];
    }
    return warehouseBinRecords.map((record) => warehouseBinRecordToWarehouseBinEntity(record));
}

export function warehouseBinsEntitiesToWarehouseBinsRecords(warehouseBins: WarehouseBin[]): object[] {
    if (!warehouseBins || warehouseBins.length === 0) {
        return [];
    }
    return warehouseBins.map((warehouseBin) => warehouseBinEntityToWarehouseBinRecord(warehouseBin));
}