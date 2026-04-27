import { productRawDatumToProductEntity } from "../../../product/router/transformer";
import { Variant, VariantGrade, VariantType } from "../../entity";

export function variantRawDatumToVariantEntity(raw: any): Variant {
    let variant = new Variant();

    if (raw === null) {
        return variant = null;
    }

    if (raw.id) {
        variant.id = raw.id;
    }

    if (raw.name) {
        variant.name = raw.name;
    }

    if (raw.product) {
        variant.product = productRawDatumToProductEntity(raw.product);
    }

    if (raw.type) {
        variant.type = raw.type as VariantType;
    }

    if (raw.grade) {
        variant.grade = raw.grade as VariantGrade;
    }

    if (raw.price) {
        variant.price = raw.price;
    }

    if (raw.images) {
        variant.images = raw.images;
    }

    if (raw.sku) {
        variant.sku = raw.sku;
    }

    if (raw.stockQuantity) {
        variant.stockQuantity = raw.stockQuantity;
    }

    return variant;
}

export function variantsRawDataToVariantsEntities(raws: any[]): Variant[] {
    if (!raws || raws.length === 0) {
        return [];
    }

    return raws.map(variantRawDatumToVariantEntity);
}