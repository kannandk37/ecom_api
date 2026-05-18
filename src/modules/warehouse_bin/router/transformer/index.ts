import { warehouseRawDatumToWarehouseEntity } from "../../../warehouse/router/transformer";
import { WarehouseBin } from "../../entity";

export function warehouseBinRawDatumToWarehouseBinEntity(raw: any): WarehouseBin {
    let warehouseBin = new WarehouseBin();

    if (raw === null || raw === undefined) {
        return warehouseBin = null;
    }

    if (raw.id) {
        warehouseBin.id = raw.id;
    }

    if (raw.warehouse) {
        warehouseBin.warehouse = warehouseRawDatumToWarehouseEntity(warehouseBin.warehouse);
    }

    if (raw.binCode) {
        warehouseBin.binCode = raw.binCode;
    }

    if (raw.aisle) {
        warehouseBin.aisle = raw.aisle;
    }

    if (raw.rack) {
        warehouseBin.rack = raw.rack;
    }

    if (raw.level) {
        warehouseBin.level = raw.level;
    }

    if (raw.position) {
        warehouseBin.position = raw.position;
    }

    if (raw.maxUnits !== undefined) {
        warehouseBin.maxUnits = Number(raw.maxUnits);
    }

    if (raw.isActive !== undefined) {
        warehouseBin.isActive = raw.isActive;
    }

    if (raw.minThreshold !== undefined) {
        warehouseBin.minThreshold = Number(raw.minThreshold);
    }

    if (raw.currentStock !== undefined) {
        warehouseBin.currentStock = Number(raw.currentStock);
    }

    if (raw.isOccupied !== undefined) {
        warehouseBin.isOccupied = raw.isOccupied;
    }

    return warehouseBin;
}

export function warehouseBinsRawDataToWarehouseBinsEntities(raws: any[]): WarehouseBin[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(warehouseBinRawDatumToWarehouseBinEntity);
}