import { OrderItemModel } from "../schema";
import { OrderItem } from "../../entity";
import { orderItemEntityToOrderItemRecord, orderItemsRecordsToOrderItemsEntities, orderItemRecordToOrderItemEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { UserModel } from "../../../user/data/schema";
import { VariantModel } from "../../../variant/data/schema";
import { ProductModel } from "../../../product/data/schema";

export class OrderItemPersistor {
    async createOrderItem(orderItem: OrderItem): Promise<OrderItem> {
        return new Promise<OrderItem>(async (resolve, reject) => {
            try {
                let orderItemData = orderItemEntityToOrderItemRecord(orderItem);
                let orderItemRecord = await OrderItemModel.create(orderItemData);
                resolve(orderItemRecordToOrderItemEntity(orderItemRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async orderItems(): Promise<OrderItem[]> {
        return new Promise<OrderItem[]>(async (resolve, reject) => {
            try {
                let orderItemsRecords = await OrderItemModel.find().populate([productPopulate(), variantPopulate()]);
                resolve(orderItemsRecordsToOrderItemsEntities(orderItemsRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async orderItemById(id: string): Promise<OrderItem> {
        return new Promise<OrderItem>(async (resolve, reject) => {
            try {
                let orderitemRecord = await OrderItemModel.findOne({ _id: new ObjectId(id) }).populate([productPopulate(), variantPopulate()]);
                resolve(orderItemRecordToOrderItemEntity(orderitemRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}

export function productPopulate() {
    return {
        path: 'product',
        model: ProductModel
    }
}

export function variantPopulate() {
    return {
        path: 'variant',
        model: VariantModel
    }
}