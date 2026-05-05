import { Product } from "../../product/entity";
import { User } from "../../user/entity";
import { Variant } from "../../variant/entity";

export class Wishlist {
    id?: string;
    user?: User;
    product?: Product;
    variant?: Variant;
    createdAt?: Date;
}
