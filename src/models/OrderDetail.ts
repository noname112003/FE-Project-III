import Variant from "./Variant";


export default class OrderDetail {
    orderId: number;
    sku: string;
    name: string;
    imagePath: string | null;
    variantId: number;
    variantQuantity: number;
    quantity: number;
    price: number;
    subTotal: number;

    constructor(orderId: number, sku: string, name: string, imagePath: string | null, variantId: number, variantQuantity: number, quantity: number, price: number, subTotal: number) {
        this.orderId = orderId;
        this.sku = sku;
        this.name = name;
        this.quantity = quantity;
        this.variantId = variantId;
        this.variantQuantity = variantQuantity;
        this.price = price;
        this.subTotal = subTotal;
        this.imagePath = imagePath;
    }

    static fromVariant(variant: Variant): OrderDetail {
        return new OrderDetail(0, variant.sku, `${variant.productName} (${variant.name})`, variant.imagePath, variant.id, variant.quantity, 1, variant.priceForSale, 0);
    }
}