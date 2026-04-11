import { userRawDatumToUserEntity } from "../../../user/router/transformer";
import { Address, AddressType } from "../../entity";

export function addressRawDatumToAddressEntity(raw: any): Address {
    let address = new Address();
    if (raw === null) {
        return address = null;
    }

    if (raw.id) {
        address.id = raw.id;
    }

    if (raw.user) {
        address.user = userRawDatumToUserEntity(raw.user);
    }

    if (raw.line1) {
        address.line1 = raw.line1;
    }

    if (raw.line2) {
        address.line2 = raw.line2;
    }

    if (raw.city) {
        address.city = raw.city;
    }

    if (raw.state) {
        address.state = raw.state;
    }

    if (raw.pincode) {
        address.pincode = raw.pincode;
    }

    if (raw.country) {
        address.country = raw.country;
    }

    if (raw.type) {
        address.type = raw.type as AddressType;
    }

    return address;
}

export function addressesRawDataToAddressesEntities(raws: any[]): Address[] {
    if (!raws || raws.length === 0) {
        return [];
    }
    return raws.map(addressRawDatumToAddressEntity);
}