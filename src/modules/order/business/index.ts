import { DateTime } from "luxon";
import { AddressManagement } from "../../address/business";
import { InvoiceManagement } from "../../invoice/business";
import { Invoice } from "../../invoice/entity";
import { OrderItemManagement } from "../../order_item/business";
import { OrderItem } from "../../order_item/entity";
import { PaymentStatus } from "../../payment/entity";
import { ProductManagement } from "../../product/business";
import { ProfileManagement } from "../../profile/business";
import { UserManagement } from "../../user/business";
import { VariantManagement } from "../../variant/business";
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
                        //TODO: need to calculate actual tax;
                        let orderItemTax: number = (orderItem.price * (18 / 100));
                        orderItem.paymentStatus = PaymentStatus.PENDING;
                        orderItem.deliveryStatus = 'pending';
                        orderItem.tax = orderItemTax;
                        // TODO: need to add for discount
                        // orderItem.discount
                        let persistorOrderItem = await orderItemManagement.createOrderItem(orderItem);
                        orderItems.push(persistorOrderItem);
                    }
                    order.status = OrderStatus.ORDERED;
                    // order.snapShot = 
                    order.orderItems = orderItems;
                }

                if (order.invoice) {
                    let invoiceItems = order.invoice.invoiceItems;
                    for (const invoiceItem of invoiceItems) {
                        let orderItem = order.orderItems.find((orderItem: OrderItem) => orderItem?.product?.id == invoiceItem?.orderItem?.product?.id && orderItem?.variant?.id == invoiceItem?.orderItem?.variant?.id);
                        invoiceItem.orderItem = orderItem;
                    }
                    let invoiceData: Invoice = { ...order.invoice, invoiceItems: invoiceItems, createdAt: DateTime.now() };
                    let invoice = await new InvoiceManagement().createInvoice(invoiceData);
                    order.invoice = invoice;
                }
                let orderId = await this.checkAndCreateOrderId();
                order.orderId = orderId;
                resolve(await orderPeristor.createOrder(order));
            } catch (error) {
                reject(error);
            }
        });
    }

    async constructAndUpdateOrderWithSnapShotById(id: string, existingOrder?: Order): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let order = existingOrder ?? await this.orderById(id);
                const [user, profile, billingAddress, deliveryAddress, invoice] = await Promise.all([
                    new UserManagement().userById(order.user.id),
                    new ProfileManagement().profileById(order.profile.id),
                    new AddressManagement().addressById(order.billingAddress.id),
                    new AddressManagement().addressById(order.deliveryAddress.id),
                    new InvoiceManagement().invoiceById(order.invoice.id),
                ]);
                const orderItems = await Promise.all(
                    order.orderItems.map(async (item) => {
                        const [orderItemData, product, variant] = await Promise.all([
                            new OrderItemManagement().orderItemById(item.id),
                            new ProductManagement().productById(item.product.id),
                            new VariantManagement().variantById(item.variant.id),
                        ]);
                        return { ...orderItemData, product, variant };
                    })
                );
                order.user = user;
                order.profile = profile;
                order.billingAddress = billingAddress;
                order.deliveryAddress = deliveryAddress;
                order.orderItems = orderItems;
                order.invoice = invoice;
                let snapShot: any = {
                    ...order
                };
                const updatedOrder = await this.updateOrderWithSnapShotById(id, snapShot);
                resolve(updatedOrder);
            } catch (error) {
                reject(error);
            }
        })
    }

    async updateOrderWithSnapShotById(id: string, snapShot: any): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderPeristor = new OrderPersistor();
                await orderPeristor.updateOrderWithSnapShotById(id, snapShot);
                resolve(await orderPeristor.orderById(id));
            } catch (error) {
                reject(error);
            }
        });
    }

    async checkAndCreateOrderId(): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let orderPersistor = new OrderPersistor();
                let count = await orderPersistor.ordersCount();
                let newOrderid = count + 1;
                while (true) {
                    let existing = await orderPersistor.orderByOrderId(`${newOrderid}`);
                    if (!existing) {
                        resolve(`${newOrderid}`);
                        return;
                    }
                    newOrderid++;
                }
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