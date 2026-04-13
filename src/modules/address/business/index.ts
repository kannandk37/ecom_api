import { AddressPersistor } from "../data/persistor";
import { Address } from "../entity";

export class AddressManagement {
    async createAddress(address: Address): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            try {
                let addressPeristor = new AddressPersistor();
                resolve(await addressPeristor.createAddress(address));
            } catch (error) {
                reject(error);
            }
        });
    }

    async addresses(): Promise<Address[]> {
        return new Promise<Address[]>(async (resolve, reject) => {
            try {
                let addressPeristor = new AddressPersistor();
                resolve(await addressPeristor.addresses());
            } catch (error) {
                reject(error);
            }
        });
    }

    async addressById(id: string): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            try {
                let addressPeristor = new AddressPersistor();
                resolve(await addressPeristor.addressById(id));
            } catch (error) {
                reject(error);
            }
        });
    }
}