import { ProductPersistor } from "../data/persistor";
import { Product } from "../entity";

export class ProductManagement {
    async createProduct(product: Product): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.createProduct(product));
            } catch (error) {
                reject(error);
            }
        });
    }

    async products(): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.products());
            } catch (error) {
                reject(error);
            }
        });
    }

    async productById(id: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.productById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}