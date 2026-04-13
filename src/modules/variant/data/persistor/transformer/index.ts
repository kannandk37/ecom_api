import { productEntityToProductRecord, productRecordToProductEntity } from "../../../../product/data/persistor/transformer";
import { Variant, VariantGrade, VariantType } from "../../../entity";
import { ObjectId } from "mongodb";

export function variantRecordToVariantEntity(variantRecord: any): Variant {
    let variant = new Variant();

    if (variantRecord === null) {
        return variant = null;
    }

    if (variantRecord._id) {
        variant.id = variantRecord._id?.toString();
    }

    if (variantRecord.product) {
        variant.product = productRecordToProductEntity(variantRecord.product);
    }

    if (variantRecord.type) {
        variant.type = variantRecord.type as VariantType;
    }

    if (variantRecord.grade) {
        variant.grade = variantRecord.grade as VariantGrade;
    }

    if (variantRecord.price !== undefined) {
        variant.price = variantRecord.price;
    }

    if (variantRecord.images && variantRecord.images.length > 0) {
        variant.images = variantRecord.images;
    }

    if (variantRecord.sku) {
        variant.sku = variantRecord.sku;
    }

    if (variantRecord.stockQuantity !== undefined) {
        variant.stockQuantity = variantRecord.stockQuantity;
    }

    return variant;
}

export function variantEntityToVariantRecord(variant: Variant): object {
    let record: any = {};

    if (variant === null) {
        return record = null;
    }

    if (variant.id) {
        record._id = new ObjectId(variant.id);
    }

    if (variant.product?.id) {
        record.product = new ObjectId(variant.product.id);
    }

    if (variant.type) {
        record.type = variant.type;
    }

    if (variant.grade) {
        record.grade = variant.grade;
    }

    if (variant.price !== undefined) {
        record.price = variant.price;
    }

    if (variant.images && variant.images.length > 0) {
        record.images = variant.images;
    }

    if (variant.sku) {
        record.sku = variant.sku;
    }

    if (variant.stockQuantity !== undefined) {
        record.stockQuantity = variant.stockQuantity;
    }

    return record;
}

export function variantsRecordsToVariantsEntities(variantRecords: any[]): Variant[] {
    if (!variantRecords || variantRecords.length === 0) {
        return [];
    }
    return variantRecords.map((record) => variantRecordToVariantEntity(record));
}

export function variantsEntitiesToVariantsRecords(variants: Variant[]): object[] {
    if (!variants || variants.length === 0) {
        return [];
    }
    return variants.map((variant) => variantEntityToVariantRecord(variant));
}