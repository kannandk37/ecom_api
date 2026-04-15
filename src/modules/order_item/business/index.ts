import { OrderItemPersistor } from "../data/persistor";
import { OrderItem } from "../entity";

export class OrderItemManagement {
    async createOrderItem(orderItem: OrderItem): Promise<OrderItem> {
        return new Promise<OrderItem>(async (resolve, reject) => {
            try {
                let orderItemPeristor = new OrderItemPersistor();
                resolve(await orderItemPeristor.createOrderItem(orderItem));
            } catch (error) {
                reject(error);
            }
        });
    }

    async orderItems(): Promise<OrderItem[]> {
        return new Promise<OrderItem[]>(async (resolve, reject) => {
            try {
                let orderItemPeristor = new OrderItemPersistor();
                resolve(await orderItemPeristor.orderItems());
            } catch (error) {
                reject(error);
            }
        });
    }

    async orderItemById(id: string): Promise<OrderItem> {
        return new Promise<OrderItem>(async (resolve, reject) => {
            try {
                let orderItemPeristor = new OrderItemPersistor();
                resolve(await orderItemPeristor.orderItemById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}