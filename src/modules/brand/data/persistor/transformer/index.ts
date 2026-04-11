import { categoryEntityToCategoryRecord, categoryRecordToCategoryEntity } from "../../../../category/data/persistor/transformer";
import { Brand } from "../../../entity";
import { ObjectId } from "mongodb";

export function brandRecordToBrandEntity(brandRecord: any): Brand {
    let brand = new Brand();

    if (brandRecord === null) {
        return brand = null;
    }

    if (brandRecord._id) {
        brand.id = brandRecord._id?.toString();
    }

    if (brandRecord.name) {
        brand.name = brandRecord.name;
    }

    if (brandRecord.description) {
        brand.description = brandRecord.description;
    }

    if (brandRecord.category) {
        brand.category = categoryRecordToCategoryEntity(brandRecord.category);
    }

    if (brandRecord.image) {
        brand.image = brandRecord.image;
    }

    return brand;
}

export function brandEntityToBrandRecord(brand: Brand): object {
    let record: any = {};

    if (brand === null) {
        return record = null;
    }

    if (brand.id) {
        record._id = new ObjectId(brand.id);
    }

    if (brand.name) {
        record.name = brand.name;
    }

    if (brand.description) {
        record.description = brand.description;
    }

    if (brand.category) {
        record.category = categoryEntityToCategoryRecord(brand.category);
    }

    if (brand.image) {
        record.image = brand.image;
    }

    return record;
}

export function brandRecordsToBrandEntities(brandRecords: any[]): Brand[] {
    if (!brandRecords || brandRecords.length === 0) {
        return [];
    }
    return brandRecords.map((record) => brandRecordToBrandEntity(record));
}

export function brandEntitiesToBrandRecords(brands: Brand[]): object[] {
    if (!brands || brands.length === 0) {
        return [];
    }
    return brands.map((brand) => brandEntityToBrandRecord(brand));
}