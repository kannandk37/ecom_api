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

    async validateSpecs(productInfoSpecs: SpecValue[]) {
        if (!productInfoSpecs?.length) return false;
        const results = await Promise.all(
            productInfoSpecs.map((spec: SpecValue) => this.validateSpecValue(spec))
        );
        return results.every(res => res === true);
    };

}