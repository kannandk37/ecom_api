import { Category } from "../../entity";

export function categoryRawDatumToCategoryEntity(raw: any): Category {
    let category = new Category();

    if (raw === null) {
        return category = null;
    }

    if (raw.id) {
        category.id = raw.id;
    }

    if (raw.name) {
        category.name = raw.name;
    }

    if (raw.description) {
        category.description = raw.description;
    }

    if (raw.subCategory) {
        category.subCategory = categoryRawDatumToCategoryEntity(raw.subCategory);
    }

    if (raw.image) {
        category.image = raw.image;
    }

    return category;
}

export function categoriesRawDataToCategoriesEntities(raws: any[]): Category[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(categoryRawDatumToCategoryEntity);
}