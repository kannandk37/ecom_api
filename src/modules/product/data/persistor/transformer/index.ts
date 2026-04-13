import { brandRecordToBrandEntity } from "../../../../brand/data/persistor/transformer";
import { categoryRecordToCategoryEntity } from "../../../../category/data/persistor/transformer";
import { variantsRecordsToVariantsEntities } from "../../../../variant/data/persistor/transformer";
import { Product, Unit } from "../../../entity";
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
        product.specs = productRecord.specs;
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
        record.specs = product.specs;
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