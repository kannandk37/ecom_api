import { Product } from "../../product/entity";
import { Variant } from "../../variant/entity";

export class CartItem {
    id?: string;
    product?: Product;
    variant?: Variant;
    quantity?: number;
}