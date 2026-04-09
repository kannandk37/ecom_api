import { Order } from "../../order/entity";
import { User } from "../../user/entity";

export class Cart {
    id?: string;
    user?: User;
    order?: Order;
}