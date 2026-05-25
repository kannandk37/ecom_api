import { CategoryPersistor } from "../data/persistor";
import { Category } from "../entity";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { Brand } from "../../brand/entity";
import { Product } from "../../product/entity";
import { BrandManagement } from "../../brand/business";
import { ProductManagement } from "../../product/business";
export class CategoryManagement {
    async createCategory(category: Category): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryPeristor = new CategoryPersistor();
                let isCategoryWithName = await this.categoryByName(category.name);
                if (isCategoryWithName) {
                    return reject(new ApiError("Category With Name Already Exists", StatusCodes.CONFLICT, true))
                }
                let persistedCategory = await categoryPeristor.createCategory(category);
                resolve(await this.categoryById(persistedCategory.id));
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

    async categoriesWithBrandsAndProducts(): Promise<{ catgeory: Category, brands: Brand[], products: Product[] }[]> {
        return new Promise<{ catgeory: Category, brands: Brand[], products: Product[] }[]>(async (resolve, reject) => {
            try {
                let categories = await new CategoryPersistor().categories();
                let result: { catgeory: Category, brands: Brand[], products: Product[] }[] = [];
                if (categories?.length > 0) {
                    for (const category of categories) {
                        let brands = await new BrandManagement().brandByCategoryId(category?.id);
                        let products = await new ProductManagement().productsByCategoryId(category?.id);
                        result.push({
                            catgeory: category,
                            brands: brands,
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

    async categoryByName(name: string): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryPeristor = new CategoryPersistor();
                resolve(await categoryPeristor.categoryByName(name));
            } catch (error) {
                reject(error);
            }
        });
    }

    async updateCategoryById(id: string, category: Category): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryPeristor = new CategoryPersistor();
                let isCategoryWithName = await this.categoryByName(category.name);
                if (isCategoryWithName?.id == id) {
                    return reject(new ApiError("Category With Name Already Exists", StatusCodes.CONFLICT, true))
                }
                await categoryPeristor.updateCategoryById(id, category);
                resolve(await this.categoryById(id));
            } catch (error) {
                reject(error);
            }
        })
    }
}