import { userEntityToUserRecord, userRecordToUserEntity } from "../../../../user/data/persistor/transformer";
import { Address, AddressType } from "../../../entity";
import { ObjectId } from "mongodb";

export function addressRecordToAddressEntity(addressRecord: any): Address {
    let address = new Address();

    if (addressRecord === null) {
        return address = null;
    }

    if (addressRecord._id) {
        address.id = addressRecord._id?.toString();
    }

    if (addressRecord.user) {
        address.user = userRecordToUserEntity(addressRecord.user);
    }

    if (addressRecord.line1) {
        address.line1 = addressRecord.line1;
    }

    if (addressRecord.line2) {
        address.line2 = addressRecord.line2;
    }

    if (addressRecord.city) {
        address.city = addressRecord.city;
    }

    if (addressRecord.state) {
        address.state = addressRecord.state;
    }

    if (addressRecord.pincode) {
        address.pincode = addressRecord.pincode;
    }

    if (addressRecord.country) {
        address.country = addressRecord.country;
    }

    if (addressRecord.type) {
        address.type = addressRecord.type as AddressType;
    }

    if (addressRecord.isActive !== undefined) {
        address.isActive = addressRecord.isActive;
    }

    return address;
}

export function addressEntityToAddressRecord(address: Address): object {
    let record: any = {};

    if (address === null) {
        return record = null;
    }

    if (address.id) {
        record._id = new ObjectId(address.id);
    }

    if (address.user) {
        record.user = userEntityToUserRecord(address.user);
    }

    if (address.line1) {
        record.line1 = address.line1;
    }

    if (address.line2) {
        record.line2 = address.line2;
    }

    if (address.city) {
        record.city = address.city;
    }

    if (address.state) {
        record.state = address.state;
    }

    if (address.pincode) {
        record.pincode = address.pincode;
    }

    if (address.country) {
        record.country = address.country;
    }

    if (address.type) {
        record.type = address.type;
    }

    if (address.isActive !== undefined) {
        record.isActive = address.isActive;
    }

    return record;
}

export function addressRecordsToAddressEntities(addressRecords: any[]): Address[] {
    if (!addressRecords || addressRecords.length === 0) {
        return [];
    }
    return addressRecords.map((record) => addressRecordToAddressEntity(record));
}

export function addressEntitiesToAddressRecords(addresses: Address[]): object[] {
    if (!addresses || addresses.length === 0) {
        return [];
    }
    return addresses.map((address) => addressEntityToAddressRecord(address));
}