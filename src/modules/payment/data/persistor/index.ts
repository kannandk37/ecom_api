import { ObjectId } from "mongodb";
import { paymentEntityToPaymentRecord, paymentRecordToPaymentEntity } from "./transformer";
import { Payment } from "../../entity";
import { PaymentModel } from "../schema";
export class PaymentPersistor {
    async createPayment(payment: Payment): Promise<Payment> {
        return new Promise<Payment>(async (resolve, reject) => {
            try {
                let paymentData = paymentEntityToPaymentRecord(payment);
                let paymentRecord = await PaymentModel.create(paymentData);
                resolve(await paymentRecordToPaymentEntity(paymentRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async paymentById(id: string): Promise<Payment> {
        return new Promise<Payment>(async (resolve, reject) => {
            try {
                let paymentRecord = await PaymentModel.findOne({ _id: new ObjectId(id) });
                resolve(await paymentRecordToPaymentEntity(paymentRecord));
            } catch (error) {
                reject(error);
            }
        })
    }
}