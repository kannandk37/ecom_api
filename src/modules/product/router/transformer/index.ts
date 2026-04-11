import { brandRawDatumToBrandEntity } from "../../../brand/router/transformer";
import { categoryRawDatumToCategoryEntity } from "../../../category/router/transformer";
import { variantsRawDataToVariantsEntities } from "../../../variant/router/transformer";
import { Product, Unit } from "../../entity";

export function productRawDatumToProductEntity(raw: any): Product {
    let product = new Product();

    if (raw === null) {
        return product = null;
    }

    if (raw.id) {
        product.id = raw.id;
    }

    if (raw.title) {
        product.title = raw.title;
    }

    if (raw.name) {
        product.name = raw.name;
    }

    if (raw.description) {
        product.description = raw.description;
    }

    if (raw.price) {
        product.price = raw.price;
    }

    if (raw.shortDescription) {
        product.shortDescription = raw.shortDescription;
    }

    if (raw.category) {
        product.category = categoryRawDatumToCategoryEntity(raw.category);
    }

    if (raw.brand) {
        product.brand = brandRawDatumToBrandEntity(raw.brand);
    }

    if (raw.variants) {
        product.variants = variantsRawDataToVariantsEntities(raw.variants);
    }

    if (raw.price) {
        product.price = raw.price;
    }

    if (raw.weight) {
        product.weight = raw.weight;
    }

    if (raw.unit) {
        product.unit = raw.unit as Unit;
    }

    if (raw.images) {
        product.images = raw.images;
    }

    if (raw.features) {
        product.features = raw.features;
    }

    if (raw.specs) {
        product.specs = raw.specs;
    }

    if (raw.slug) {
        product.slug = raw.slug;
    }

    if (raw.averageRating) {
        product.averageRating = raw.averageRating;
    }

    return product;
}

export function productsRawDataToProductsEntities(raws: any[]): Product[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map((raw) => productRawDatumToProductEntity(raw));
}