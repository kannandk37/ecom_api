import { User } from "../../user/entity";

export enum AddressType {
    HOME = 'home',
    OFFICE = 'office',
    OTHER = 'other'
}


export class Address {
    id?: string;
    user?: User;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    isActive?: boolean;
    type?: AddressType;
}