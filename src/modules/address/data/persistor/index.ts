import { AddressModel } from "../schema";
import { Address } from "../../entity";
import { addressEntityToAddressRecord, addressesRecordsToAddressesEntities, addressRecordToAddressEntity } from "./transformer";
import { ObjectId } from "mongodb";
import { UserModel } from "../../../user/data/schema";

export class AddressPersistor {
    async createAddress(address: Address): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            try {
                let addressData = addressEntityToAddressRecord(address);
                let addressRecord = await AddressModel.create(addressData);
                resolve(addressRecordToAddressEntity(addressRecord));
            } catch (error) {
                reject(error);
            }
        })
    }

    async addresses(): Promise<Address[]> {
        return new Promise<Address[]>(async (resolve, reject) => {
            try {
                let addressesRecords = await AddressModel.find().populate([userPopulate()]);
                resolve(addressesRecordsToAddressesEntities(addressesRecords));
            } catch (error) {
                reject(error);
            }
        })
    }

    async addressById(id: string): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            try {
                let addressRecord = await AddressModel.findOne({ _id: new ObjectId(id) }).populate([userPopulate()]);
                resolve(addressRecordToAddressEntity(addressRecord));
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