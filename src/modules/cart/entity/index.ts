import { CartItem } from "../../cart_item/entity";
import { User } from "../../user/entity";

export class Cart {
    id?: string;
    user?: User;
    cartItems?: CartItem[];
    appliedPromocode?: string;
    isActive?: boolean;
}