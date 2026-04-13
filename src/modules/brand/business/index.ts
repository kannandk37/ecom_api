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
}