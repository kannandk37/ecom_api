import { CategoryPersistor } from "../data/persistor";
import { Category } from "../entity";

export class CategoryManagement {
    async createCategory(category: Category): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryPeristor = new CategoryPersistor();
                if (category.subCategory) {
                    category.subCategory = await categoryPeristor.createCategory(category.subCategory);
                }
                resolve(await categoryPeristor.createCategory(category));
            } catch (error) {
                reject(error);
            }
        });
    }

    async categories(): Promise<Category[]> {
        return new Promise<Category[]>(async (resolve, reject) => {
            try {
                let categoryPeristor = new CategoryPersistor();
                resolve(await categoryPeristor.categories());
            } catch (error) {
                reject(error);
            }
        });
    }

    async categoryById(id: string): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryPeristor = new CategoryPersistor();
                resolve(await categoryPeristor.categoryById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}