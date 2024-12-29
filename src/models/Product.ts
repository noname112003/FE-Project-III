export default class Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    brandId: number;
    brandName: string;
    description: string;
    totalQuantity: number;
    status: boolean;

    constructor(id: number, name: string, categoryId: number, categoryName: string, brandId: number, brandName: string, description: string, totalQuantity: number, status: boolean) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.brandId = brandId;
        this.brandName = brandName;
        this.description = description;
        this.totalQuantity = totalQuantity;
        this.status = status;
    }

    static fromJson(json: any): Product {
        return new Product(json.id, json.name, json.categoryId, json.categoryName, json.brandId, json.brandName, json.description, json.totalQuantity, json.status);
    }
}