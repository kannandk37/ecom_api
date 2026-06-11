import { PaymentPersistor } from "../data/persistor";
import { Payment } from "../entity";

export class PaymentManagement {
    async createPayment(payment: Payment): Promise<Payment> {
        return new Promise<Payment>(async (resolve, reject) => {
            try {
                let paymentPeristor = new PaymentPersistor();
                let persistedPayment = await paymentPeristor.createPayment(payment);
                resolve(persistedPayment);
            } catch (error) {
                reject(error);
            }
        });
    }

    async paymentById(id: string): Promise<Payment> {
        return new Promise<Payment>(async (resolve, reject) => {
            try {
                let paymentPeristor = new PaymentPersistor();
                resolve(await paymentPeristor.paymentById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}