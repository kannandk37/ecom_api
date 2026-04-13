import { BrandModel } from "../../../brand/data/schema";
import { CategoryModel } from "../../../category/data/schema";
import { VariantModel } from "../../../variant/data/schema";
import { Product } from "../../entity";
import { ProductModel } from "../schema";
import { productEntityToProductRecord, productsRecordsToProductsEntities, productRecordToProductEntity } from "./transformer";
import { ObjectId } from "mongodb";

export class ProductPersistor {
    async createProduct(product: Product): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productData = productEntityToProductRecord(product);
                let productRecord = await ProductModel.create(productData);
                resolve(productRecordToProductEntity(productRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async products(): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productsRecords = await ProductModel.find().populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(productsRecordsToProductsEntities(productsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async productById(id: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productRecord = await ProductModel.findOne({ _id: new ObjectId(id) }).populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(productRecordToProductEntity(productRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}

export function categoryPopulate() {
    return {
        path: 'category',
        model: CategoryModel
    }
}

export function brandPopulate() {
    return {
        path: 'brand',
        model: BrandModel
    }
}

export function variantsPopulate() {
    return {
        path: 'variants',
        model: VariantModel
    }
}