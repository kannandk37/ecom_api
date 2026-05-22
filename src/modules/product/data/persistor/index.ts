import { BrandModel } from "../../../brand/data/schema";
import { CategoryModel } from "../../../category/data/schema";
import { VariantModel } from "../../../variant/data/schema";
import { Variant } from "../../../variant/entity";
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
                resolve(await productRecordToProductEntity(productRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async products(): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productsRecords = await ProductModel.find().populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(await productsRecordsToProductsEntities(productsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async productById(id: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productRecord = await ProductModel.findOne({ _id: new ObjectId(id) }).populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(await productRecordToProductEntity(productRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async productsByIds(ids: string[]): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productRecords = await ProductModel.find({ _id: { $in: ids?.map((id) => (new ObjectId(id))) } }).populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(await productsRecordsToProductsEntities(productRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async productsByCategoryId(categoryId: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productsRecords = await ProductModel.find({ category: new ObjectId(categoryId) }).populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(await productsRecordsToProductsEntities(productsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async productsByName(value: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productsRecords = await ProductModel.find({
                    $or: [
                        { name: { $regex: value, $options: "i" } }
                    ]
                }).populate([categoryPopulate(), brandPopulate(), variantsPopulate()]);
                resolve(await productsRecordsToProductsEntities(productsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async addVaraintToProduct(product: Product, variant: Variant): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                await ProductModel.updateOne(
                    { _id: new ObjectId(product.id) },
                    { $addToSet: { variants: new ObjectId(variant.id) } }
                );
                resolve(this.productById(product?.id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async removeVaraintFromProduct(product: Product, variant: Variant): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                await ProductModel.updateOne(
                    { _id: new ObjectId(product.id) },
                    { $pull: { variants: new ObjectId(variant.id) } }
                );
                resolve(this.productById(product?.id));
            } catch (error) {
                reject(error);
            }
        });
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