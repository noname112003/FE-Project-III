export default class Variant {
    id: number;
    name: string;
    productId: number;
    productName: string;
    sku: string;
    size: string;
    color: string;
    material: string;
    quantity: number;
    initialPrice: number;
    priceForSale: number;
    status: boolean;
    imagePath: string;

    constructor(id: number, name: string, productId: number, productName: string, sku: string, size: string, color: string, material: string, quantity: number, initialPrice: number, priceForSale: number, status: boolean, imagePath: string) {
        this.id = id;
        this.name = name;
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.size = size;
        this.color = color;
        this.material = material;
        this.quantity = quantity;
        this.initialPrice = initialPrice;
        this.priceForSale = priceForSale;
        this.status = status;
        this.imagePath = imagePath;
    }

    static fromJson(json: any): Variant {
        return new Variant(json.id, json.name, json.productId, json.productName, json.sku, json.size, json.color, json.material, json.quantity, json.initialPrice, json.priceForSale, json.status, json.imagePath);
    }
}