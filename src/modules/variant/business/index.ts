import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { ProductManagement } from "../../product/business";
import { VariantPersistor } from "../data/persistor";
import { Variant } from "../entity";

export class VariantManagement {
    async createVariant(variant: Variant): Promise<Variant> {
        return new Promise<Variant>(async (resolve, reject) => {
            try {
                let variantPeristor = new VariantPersistor();
                let productManager = new ProductManagement();
                let product = await productManager.productById(variant.product?.id);
                if (!product) {
                    return reject(new ApiError('Product Not Found', StatusCodes.NOT_FOUND, true));
                }
                // TODO: need validation for variant create with required fields
                let createdVariant = await variantPeristor.createVariant(variant);
                await productManager.addVaraintToProduct(product, createdVariant);
                resolve(await this.variantById(createdVariant?.id));
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