import { Category } from "../../entity";
import { CategoryModel } from "../schema";
import { categoryEntityToCategoryRecord, categoriesRecordsToCategoriesEntities, categoryRecordToCategoryEntity } from "./transformer";
import { ObjectId } from "mongodb";

export class CategoryPersistor {
    async createCategory(category: Category): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryData = categoryEntityToCategoryRecord(category);
                let categoryRecord = await CategoryModel.create(categoryData);
                resolve(await categoryRecordToCategoryEntity(categoryRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async categories(): Promise<Category[]> {
        return new Promise<Category[]>(async (resolve, reject) => {
            try {
                let categoriesRecords = await CategoryModel.find().populate({
                    path: 'subCategory',
                    model: CategoryModel
                });
                resolve(categoriesRecordsToCategoriesEntities(categoriesRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async categoryById(id: string): Promise<Category> {
        return new Promise<Category>(async (resolve, reject) => {
            try {
                let categoryRecord = await CategoryModel.findOne({ _id: new ObjectId(id) }).populate({
                    path: 'subCategory',
                    model: CategoryModel
                });
                resolve(categoryRecordToCategoryEntity(categoryRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}