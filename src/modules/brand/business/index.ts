import { ProductManagement } from "../../product/business";
import { Product } from "../../product/entity";
import { BrandPersistor } from "../data/persistor";
import { Brand } from "../entity";

export class BrandManagement {
    async createBrand(brand: Brand): Promise<Brand> {
        return new Promise<Brand>(async (resolve, reject) => {
            try {
                let brandPeristor = new BrandPersistor();
                resolve(await brandPeristor.createBrand(brand));
            } catch (error) {
                reject(error);
            }
        });
    }

    async brands(): Promise<Brand[]> {
        return new Promise<Brand[]>(async (resolve, reject) => {
            try {
                let brandPeristor = new BrandPersistor();
                resolve(await brandPeristor.brands());
            } catch (error) {
                reject(error);
            }
        });
    }

    async brandsWithProducts(): Promise<{ brand: Brand, products: Product[] }[]> {
            return new Promise<{ brand: Brand, products: Product[] }[]>(async (resolve, reject) => {
                try {
                    let brands = await new BrandPersistor().brands();
                    let result: { brand: Brand, products: Product[] }[] = [];
                    if (brands?.length > 0) {
                        for (const brand of brands) {
                            let products = await new ProductManagement().productsByBrandId(brand?.id);
                            result.push({
                                brand: brand,
                                products: products
                            })
                        }
                    }
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        }

    async brandById(id: string): Promise<Brand> {
        return new Promise<Brand>(async (resolve, reject) => {
            try {
                let brandPeristor = new BrandPersistor();
                resolve(await brandPeristor.brandById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async brandByCategoryId(categoryId: string): Promise<Brand[]> {
        return new Promise<Brand[]>(async (resolve, reject) => {
            try {
                let brandPeristor = new BrandPersistor();
                resolve(await brandPeristor.brandByCategoryId(categoryId));
            } catch (error) {
                reject(error);
            }
        });
    }
}