import { StatusCodes } from "http-status-codes";
import ApiError from "../../../exceptions/apierror";
import { ProductManagement } from "../../product/business";
import { VariantPersistor } from "../data/persistor";
import { Variant } from "../entity";
import { Product } from "../../product/entity";

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
                if (await this.isDuplicateVariant(product, variant)) {
                    return reject(new ApiError(
                        `Variant Already Exists — A Variant With The Same Name Or Same Type/Grade/Weight/Unit Combination Already Exists for This Product`,
                        StatusCodes.CONFLICT,
                        true
                    ));
                }
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

    async isDuplicateVariant(product: Product, variant: Variant): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                return resolve(!!product.variants?.find((el) => {
                    const sameName = el.name === variant.name;
                    const sameSpecs =
                        el.type === variant.type &&
                        el.grade === variant.grade &&
                        el.weight === variant.weight &&
                        el.unit === variant.unit;

                    return sameName || sameSpecs;
                }));
            } catch (error) {
                reject(error);
            }
        });
    }
}