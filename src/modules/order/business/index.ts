import { OrderItemManagement } from "../../order_item/business";
import { OrderItem } from "../../order_item/entity";
import { OrderPersistor } from "../data/persistor";
import { Order, OrderStatus } from "../entity";

export class OrderManagement {
    async createOrder(order: Order): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderPeristor = new OrderPersistor();
                if (order.orderItems?.length > 0) {
                    let orderItemManagement = new OrderItemManagement()
                    let orderItems: OrderItem[] = [];
                    for (const orderItem of order.orderItems) {
                        let persistorOrderItem = await orderItemManagement.createOrderItem(orderItem);
                        orderItems.push(persistorOrderItem);
                    }
                    order.status = OrderStatus.ORDERED;
                    // order.snapShot = 
                    order.orderItems = orderItems;
                }
                resolve(await orderPeristor.createOrder(order));
            } catch (error) {
                reject(error);
            }
        });
    }

    async orders(): Promise<Order[]> {
        return new Promise<Order[]>(async (resolve, reject) => {
            try {
                let orderPeristor = new OrderPersistor();
                resolve(await orderPeristor.orders());
            } catch (error) {
                reject(error);
            }
        });
    }

    async orderById(id: string): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderPeristor = new OrderPersistor();
                resolve(await orderPeristor.orderById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async ordersByUserId(userId: string): Promise<Order[]> {
        return new Promise<Order[]>(async (resolve, reject) => {
            try {
                let orderPeristor = new OrderPersistor();
                resolve(await orderPeristor.ordersByUserId(userId));
            } catch (error) {
                reject(error);
            }
        });
    }

    async orderByIdAndUserId(id: string, userId: string): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderPeristor = new OrderPersistor();
                resolve(await orderPeristor.orderByIdAndUserId(id, userId));
            } catch (error) {
                reject(error);
            }
        });
    }
}