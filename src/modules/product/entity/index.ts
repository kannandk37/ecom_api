import { Brand } from "../../brand/entity";
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
    YEAR = 'year',
    DAYS = 'days',
    WEEKS = 'weeks',
    MONTHS = 'months',
    YEARS = 'years'
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

export interface ShelfLifeValue {
    quantity: number;       // e.g. 12
    unit: Duration;         // e.g. Duration.WEEK
}

export type SpecValue =
    | { label: Label.ORIGIN; value: string }           // "India", "USA"
    | { label: Label.STORAGE; value: Storage }          // Storage.COOL_DRY_PLACE
    | { label: Label.SHELF_LIFE; value: ShelfLifeValue }   // { quantity: 12, unit: Duration.WEEK }


export class Product {
    id?: string;
    title?: string;
    name?: string;
    description?: string;
    shortDescription?: string;
    category?: Category;
    brand?: Brand;
    variants?: Variant[];
    price?: number;
    weight?: string;
    unit?: Unit;
    images?: string[];
    features?: string[];
    specs?: SpecValue[];
    // Added:
    slug?: string; // URL-friendly name (e.g., "premium-almonds") for SEO
    averageRating?: number; // For sorting and displaying popularity
}