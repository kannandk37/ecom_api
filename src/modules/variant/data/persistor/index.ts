import { VariantModel } from "../schema";
import { Variant } from "../../entity";
import { variantEntityToVariantRecord, variantsRecordsToVariantsEntities, variantRecordToVariantEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { ProductModel } from "../../../product/data/schema";

export class VariantPersistor {
    async createVariant(variant: Variant): Promise<Variant> {
        return new Promise<Variant>(async (resolve, reject) => {
            try {
                let variantData = variantEntityToVariantRecord(variant);
                let variantRecord = await VariantModel.create(variantData);
                resolve(variantRecordToVariantEntity(variantRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async variants(): Promise<Variant[]> {
        return new Promise<Variant[]>(async (resolve, reject) => {
            try {
                let variantsRecords = await VariantModel.find().populate([productPopulate()]);
                resolve(variantsRecordsToVariantsEntities(variantsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async variantById(id: string): Promise<Variant> {
        return new Promise<Variant>(async (resolve, reject) => {
            try {
                let variantRecord = await VariantModel.findOne({ _id: new ObjectId(id) }).populate([productPopulate()]);
                resolve(variantRecordToVariantEntity(variantRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}

export function productPopulate() {
    return {
        path: 'product',
        model: ProductModel
    }
}