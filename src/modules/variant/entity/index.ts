import { Product } from "../../product/entity";

export enum VariantType {
    FULL = 'full',
    BROKE = 'broke',
    SPARE = 'spare'
}

export enum VariantGrade {
    GRADE1 = 'grade1',
    GRADE2 = 'grade2'
}

export enum Unit {
    KG = 'kg',
    G = 'g'
}
export class Variant {
    id?: string;
    name?: string;
    product?: Product;
    type?: VariantType;
    grade?: VariantGrade;
    price?: number;
    unit?: Unit;
    weight?: string;
    images?: string[];
    // Added:
    sku?: string; // Stock Keeping Unit - mandatory for inventory management
}