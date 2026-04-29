import { brandRecordToBrandEntity } from "../../../../brand/data/persistor/transformer";
import { categoryRecordToCategoryEntity } from "../../../../category/data/persistor/transformer";
import { variantsRecordsToVariantsEntities } from "../../../../variant/data/persistor/transformer";
import { Duration, Label, Product, SpecValue, Unit, Storage } from "../../../entity";
import { ObjectId } from "mongodb";

export function productRecordToProductEntity(productRecord: any): Product {
    let product = new Product();

    if (productRecord === null) {
        return product = null;
    }

    if (productRecord._id) {
        product.id = productRecord._id?.toString();
    }

    if (productRecord.title) {
        product.title = productRecord.title;
    }

    if (productRecord.name) {
        product.name = productRecord.name;
    }

    if (productRecord.description) {
        product.description = productRecord.description;
    }

    if (productRecord.shortDescription) {
        product.shortDescription = productRecord.shortDescription;
    }

    if (productRecord.category) {
        product.category = categoryRecordToCategoryEntity(productRecord.category);
    }

    if (productRecord.brand) {
        product.brand = brandRecordToBrandEntity(productRecord.brand);
    }

    if (productRecord.variants && productRecord.variants.length > 0) {
        product.variants = variantsRecordsToVariantsEntities(productRecord.variants);
    }

    if (productRecord.price !== undefined) {
        product.price = productRecord.price;
    }

    if (productRecord.weight) {
        product.weight = productRecord.weight;
    }

    if (productRecord.unit) {
        product.unit = productRecord.unit as Unit;
    }

    if (productRecord.images && productRecord.images.length > 0) {
        product.images = productRecord.images;
    }

    if (productRecord.features && productRecord.features.length > 0) {
        product.features = productRecord.features;
    }

    if (productRecord.specs && productRecord.specs.length > 0) {
        product.specs = transformSpecs(productRecord.specs);
    }

    if (productRecord.slug) {
        product.slug = productRecord.slug;
    }

    if (productRecord.averageRating !== undefined) {
        product.averageRating = productRecord.averageRating;
    }

    return product;
}

export function productEntityToProductRecord(product: Product): object {
    let record: any = {};

    if (product === null) {
        return record = null;
    }

    if (product.id) {
        record._id = new ObjectId(product.id)
    }

    if (product.title) {
        record.title = product.title;
    }

    if (product.name) {
        record.name = product.name;
    }

    if (product.description) {
        record.description = product.description;
    }

    if (product.shortDescription) {
        record.shortDescription = product.shortDescription;
    }

    if (product.category?.id) {
        record.category = new ObjectId(product.category.id);
    }

    if (product.brand?.id) {
        record.brand = new ObjectId(product.brand.id);
    }

    if (product.variants && product.variants.length > 0) {
        record.variants = product.variants.map((item) => new ObjectId(item.id));
    }

    if (product.price !== undefined) {
        record.price = product.price;
    }

    if (product.weight) {
        record.weight = product.weight;
    }

    if (product.unit) {
        record.unit = product.unit;
    }

    if (product.images && product.images.length > 0) {
        record.images = product.images;
    }

    if (product.features && product.features.length > 0) {
        record.features = product.features;
    }

    if (product.specs && product.specs.length > 0) {
        record.specs = product.specs.map((spec) => {
            if (spec.label === Label.SHELF_LIFE) {
                return {
                    label: spec.label,
                    value: {
                        quantity: spec.value.quantity,
                        unit: spec.value.unit
                    }
                };
            }
            return { label: spec.label, value: spec.value };
        });
    }

    if (product.slug) {
        record.slug = product.slug;
    }

    if (product.averageRating !== undefined) {
        record.averageRating = product.averageRating;
    }

    return record;
}

export function productsRecordsToProductsEntities(productRecords: any[]): Product[] {
    if (!productRecords || productRecords.length === 0) {
        return [];
    }
    return productRecords.map((record) => productRecordToProductEntity(record));
}

export function productsEntitiesToProductsRecords(products: Product[]): object[] {
    if (!products || products.length === 0) {
        return [];
    }
    return products.map((product) => productEntityToProductRecord(product));
}

function rawSpecToSpecValue(raw: any): SpecValue | null {
    if (!raw || !raw.label || raw.value === undefined) return null;

    switch (raw.label) {

        case Label.ORIGIN: {
            if (typeof raw.value !== 'string' || !raw.value.trim()) return null;
            const spec: Extract<SpecValue, { label: Label.ORIGIN }> = {
                label: Label.ORIGIN,
                value: raw.value.trim()
            };
            return spec;
        }

        case Label.STORAGE: {
            if (!Object.values(Storage).includes(raw.value)) return null;
            const spec: Extract<SpecValue, { label: Label.STORAGE }> = {
                label: Label.STORAGE,
                value: raw.value as Storage
            };
            return spec;
        }

        case Label.SHELF_LIFE: {
            if (typeof raw.value === 'object' && raw.value !== null) {
                const qty = Number(raw.value.quantity);
                const unit = raw.value.unit as Duration;
                if (!qty || qty < 1 || !Object.values(Duration).includes(unit)) return null;
                const spec: Extract<SpecValue, { label: Label.SHELF_LIFE }> = {
                    label: Label.SHELF_LIFE,
                    value: { quantity: qty, unit }
                };
                return spec;
            }
            if (typeof raw.value === 'string') {
                const [qtyStr, unit] = raw.value.trim().split(' ');
                const qty = Number(qtyStr);
                if (!qty || qty < 1 || !Object.values(Duration).includes(unit as Duration)) return null;
                const spec: Extract<SpecValue, { label: Label.SHELF_LIFE }> = {
                    label: Label.SHELF_LIFE,
                    value: { quantity: qty, unit: unit as Duration }
                };
                return spec;
            }
            return null;
        }

        default:
            return null;
    }
}

export function transformSpecs(rawSpecs: any[]): SpecValue[] {
    if (!Array.isArray(rawSpecs) || rawSpecs.length === 0) return [];

    const seen = new Set<string>();
    const results: SpecValue[] = [];

    for (const raw of rawSpecs) {
        const spec = rawSpecToSpecValue(raw);
        if (!spec) continue;
        if (seen.has(spec.label)) continue;
        seen.add(spec.label);
        results.push(spec);
    }

    return results;
}