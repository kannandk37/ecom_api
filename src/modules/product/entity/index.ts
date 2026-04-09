import { Category } from "../../category/entity";
import { Variant } from "../../variant/entity";

export enum Storage {
    COOL_PLACE = 'cool place',
    DRY_PLACE = 'dry place',
    COOL_DRY_PLACE = 'cool dry place'
}

export enum Duration {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year'
}

export enum Unit {
    KG = 'kg',
    G = 'g'
}
export enum Label {
    ORIGIN = 'origin',
    SHELF_LIFE = 'shelf life',
    STORAGE = 'storage'
}

export class Product {
    id?: string;
    title?: string;
    name?: string;
    description?: string;
    shortDescription?: string;
    category?: Category;
    brandId?: string;
    variants?: Variant[];
    price?: number;
    weight?: string;
    unit?: Unit;
    images?: string[];
    features?: string[];
    specs?: { label: Label, value: string | Duration | Storage }[];
    // Added:
    slug?: string; // URL-friendly name (e.g., "premium-almonds") for SEO
    averageRating?: number; // For sorting and displaying popularity
}