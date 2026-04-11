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

export class Variant {
    id?: string;
    product?: Product;
    type?: VariantType;
    grade?: VariantGrade;
    price?: number;
    images?: string[];
    // Added:
    sku?: string; // Stock Keeping Unit - mandatory for inventory management
    stockQuantity?: number; // To prevent overselling
}