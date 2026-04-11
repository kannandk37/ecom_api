import { Category } from "../../../entity";
import { ObjectId } from "mongodb";

export function categoryRecordToCategoryEntity(categoryRecord: any): Category {
    let category = new Category();

    if (categoryRecord === null) {
        return category = null;
    }

    if (categoryRecord._id) {
        category.id = categoryRecord._id?.toString();
    }

    if (categoryRecord.name) {
        category.name = categoryRecord.name;
    }

    if (categoryRecord.description) {
        category.description = categoryRecord.description;
    }

    if (categoryRecord.subCategory) {
        category.subCategory = categoryRecordToCategoryEntity(categoryRecord.subCategory);
    }

    if (categoryRecord.image) {
        category.image = categoryRecord.image;
    }

    return category;
}

export function categoryEntityToCategoryRecord(category: Category): object {
    let record: any = {};

    if (category === null) {
        return record = null;
    }

    if (category.id) {
        record._id = new ObjectId(category.id);
    }

    if (category.name) {
        record.name = category.name;
    }

    if (category.description) {
        record.description = category.description;
    }

    if (category.subCategory?.id) {
        record.subCategory = new ObjectId(category.subCategory.id);
    }

    if (category.image) {
        record.image = category.image;
    }

    return record;
}

export function categoryRecordsToCategoryEntities(categoryRecords: any[]): Category[] {
    if (!categoryRecords || categoryRecords.length === 0) {
        return [];
    }
    return categoryRecords.map((record) => categoryRecordToCategoryEntity(record));
}

export function categoryEntitiesToCategoryRecords(categories: Category[]): object[] {
    if (!categories || categories.length === 0) {
        return [];
    }
    return categories.map((category) => categoryEntityToCategoryRecord(category));
}