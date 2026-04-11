import { categoryRawDatumToCategoryEntity } from "../../../category/router/transformer";
import { Brand } from "../../entity";

export function brandRawDatumToBrandEntity(raw: any): Brand {
    let brand = new Brand();

    if (raw === null) {
        return brand = null;
    }

    if (raw.id) {
        brand.id = raw.id;
    }

    if (raw.name) {
        brand.name = raw.name;
    }

    if (raw.description) {
        brand.description = raw.description;
    }

    if (raw.category) {
        brand.category = categoryRawDatumToCategoryEntity(raw.category);
    }

    if (raw.image) {
        brand.image = raw.image;
    }

    return brand;
}

export function brandsRawDataToBrandsEntities(raws: any[]): Brand[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map((raw) => brandRawDatumToBrandEntity(raw));
}