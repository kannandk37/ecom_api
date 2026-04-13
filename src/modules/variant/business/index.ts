import { VariantPersistor } from "../data/persistor";
import { Variant } from "../entity";

export class VariantManagement {
    async createVariant(variant: Variant): Promise<Variant> {
        return new Promise<Variant>(async (resolve, reject) => {
            try {
                let variantPeristor = new VariantPersistor();
                resolve(await variantPeristor.createVariant(variant));
            } catch (error) {
                reject(error);
            }
        });
    }

    async variants(): Promise<Variant[]> {
        return new Promise<Variant[]>(async (resolve, reject) => {
            try {
                let variantPeristor = new VariantPersistor();
                resolve(await variantPeristor.variants());
            } catch (error) {
                reject(error);
            }
        });
    }

    async variantById(id: string): Promise<Variant> {
        return new Promise<Variant>(async (resolve, reject) => {
            try {
                let variantPeristor = new VariantPersistor();
                resolve(await variantPeristor.variantById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}