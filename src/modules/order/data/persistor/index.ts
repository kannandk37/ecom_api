import { OrderModel } from "../schema";
import { Order } from "../../entity";
import { orderEntityToOrderRecord, ordersRecordsToOrdersEntities, orderRecordToOrderEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { UserModel } from "../../../user/data/schema";
import { OrderItemModel } from "../../../order_item/data/schema";
import { InvoiceModel } from "../../../invoice/data/schema";
import { AddressModel } from "../../../address/data/schema";

export class OrderPersistor {
    async createOrder(order: Order): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderData = orderEntityToOrderRecord(order);
                let orderRecord = await OrderModel.create(orderData);
                resolve(orderRecordToOrderEntity(orderRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async orders(): Promise<Order[]> {
        return new Promise<Order[]>(async (resolve, reject) => {
            try {
                let ordersRecords = await OrderModel.find().populate([userPopulate(), orderItemsPopulate(), billingAddressPopulate(), deliveryAddressPopulate(), invoicePopulate()]);
                resolve(ordersRecordsToOrdersEntities(ordersRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async orderById(id: string): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderRecord = await OrderModel.findOne({ _id: new ObjectId(id) }).populate([userPopulate(), orderItemsPopulate(), billingAddressPopulate(), deliveryAddressPopulate(), invoicePopulate()]);
                resolve(orderRecordToOrderEntity(orderRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async ordersByUserId(userId: string): Promise<Order[]> {
        return new Promise<Order[]>(async (resolve, reject) => {
            try {
                let ordersRecords = await OrderModel.find({ user: new ObjectId(userId) }).populate([userPopulate(), orderItemsPopulate(), billingAddressPopulate(), deliveryAddressPopulate(), invoicePopulate()]);
                resolve(ordersRecordsToOrdersEntities(ordersRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async orderByIdAndUserId(id: string, userId: string): Promise<Order> {
        return new Promise<Order>(async (resolve, reject) => {
            try {
                let orderRecord = await OrderModel.find({ _id: new ObjectId(id), user: new ObjectId(userId) }).populate([userPopulate(), orderItemsPopulate(), billingAddressPopulate(), deliveryAddressPopulate(), invoicePopulate()]);
                resolve(orderRecordToOrderEntity(orderRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}

export function userPopulate() {
    return {
        path: 'user',
        model: UserModel
    }
}

export function orderItemsPopulate() {
    return {
        path: 'orderItems',
        model: OrderItemModel
    }
}

export function billingAddressPopulate() {
    return {
        path: 'billingAddress',
        model: AddressModel
    }
}

export function deliveryAddressPopulate() {
    return {
        path: 'deliveryAddress',
        model: AddressModel
    }
}

export function invoicePopulate() {
    return {
        path: 'invoice',
        model: InvoiceModel
    }
}