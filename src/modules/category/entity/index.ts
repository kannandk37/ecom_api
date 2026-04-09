export class Category {
    id?: string;
    name?: string;
    description?: string;
    subCategory?: Category; // Reference to parent/child category
    image?: string;
}