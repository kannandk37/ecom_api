import { CategoryModel } from "../../../category/data/schema";
import { Brand } from "../../entity";
import { BrandModel } from "../schema";
import { brandEntityToBrandRecord, brandsRecordsToBrandsEntities, brandRecordToBrandEntity } from "./transformer";
import { ObjectId } from "mongodb";

export class BrandPersistor {
    async createBrand(brand: Brand): Promise<Brand> {
        return new Promise<Brand>(async (resolve, reject) => {
            try {
                let brandData = brandEntityToBrandRecord(brand);
                let brandRecord = await BrandModel.create(brandData);
                resolve(await brandRecordToBrandEntity(brandRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async brands(): Promise<Brand[]> {
        return new Promise<Brand[]>(async (resolve, reject) => {
            try {
                let brandsRecords = await BrandModel.find().populate({
                    path: 'category',
                    model: CategoryModel
                });
                resolve(await brandsRecordsToBrandsEntities(brandsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async brandById(id: string): Promise<Brand> {
        return new Promise<Brand>(async (resolve, reject) => {
            try {
                let brandRecord = await BrandModel.findOne({ _id: new ObjectId(id) }).populate({
                    path: 'category',
                    model: CategoryModel
                });
                resolve(await brandRecordToBrandEntity(brandRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}