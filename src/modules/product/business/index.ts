import { InventoryPersistor } from "../../inventory/data/persistor";
import { Inventory } from "../../inventory/entity";
import { Variant } from "../../variant/entity";
import { ProductPersistor } from "../data/persistor";
import { Duration, Label, Product, ShelfLifeValue, SpecValue, Storage } from "../entity";

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

    async productsByIds(ids: string[]): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.productsByIds(ids));
            } catch (error) {
                reject(error);
            }
        });
    }

    async productsByCategoryId(categoryId: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.productsByCategoryId(categoryId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async productsByBrandId(brandId: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.productsByBrandId(brandId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async productsByWarehouseId(warehouseId: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let inventoryPeristor = new InventoryPersistor();
                let inventories = await inventoryPeristor.inventoriesByWarehouseId(warehouseId);
                let products: Product[] = [];
                if (inventories?.length > 0) {
                    products = await this.productsByIds(inventories.map((el: Inventory) => el.product?.id))
                }
                resolve(products);
            } catch (error) {
                reject(error);
            }
        });
    }

    async validateSpecValue(spec: SpecValue): Promise<boolean> {
        switch (spec.label) {

            case Label.ORIGIN:
                return typeof spec.value === 'string' && spec.value.trim().length > 0;

            case Label.STORAGE:
                return Object.values(Storage).includes(spec.value);

            case Label.SHELF_LIFE:
                const v = spec.value as ShelfLifeValue;
                return (
                    v !== null &&
                    typeof v === 'object' &&
                    typeof v.quantity === 'number' &&
                    v.quantity >= 1 &&
                    Object.values(Duration).includes(v.unit)
                );

            default:
                return false;
        }
    }

    async productsByName(value: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.productsByName(value));
            } catch (error) {
                reject(error);
            }
        });
    }

    async validateSpecs(productInfoSpecs: SpecValue[]) {
        if (!productInfoSpecs?.length) return false;
        const results = await Promise.all(
            productInfoSpecs.map((spec: SpecValue) => this.validateSpecValue(spec))
        );
        return results.every(res => res === true);
    };

    async addVaraintToProduct(product: Product, variant: Variant): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.addVaraintToProduct(product, variant));
            } catch (error) {
                reject(error);
            }
        });
    }

    async removeVaraintFromProduct(product: Product, variant: Variant): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                let productPeristor = new ProductPersistor();
                resolve(await productPeristor.removeVaraintFromProduct(product, variant));
            } catch (error) {
                reject(error);
            }
        });
    }
}