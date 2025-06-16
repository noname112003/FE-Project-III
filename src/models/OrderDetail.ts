import Variant from "./Variant";
import {VariantResponse} from "./ProductInterface.tsx";


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

    static fromVariant(variant: VariantResponse): OrderDetail {
        return new OrderDetail(0, variant.sku, `${variant.productName} (${variant.name})`, variant.imagePath, variant.id, variant?.variantStores[0]?.quantity, 0, variant.priceForSale, 0);
    }

    static fromApiOrderDetails(orderDetailsApi: any[], orderId: number): OrderDetail[] {
        return orderDetailsApi.map((detail: any) => {
            const variant = detail.variant || {};
            const variantQuantity = variant.quantity || 0;
            const price = variant.priceForSale || 0;
            const name = variant.productName ? `${variant.productName} (${variant.name})` : variant.name || '';

            return new OrderDetail(
                orderId,
                variant.sku || '',
                name,
                variant.imagePath || null,
                variant.id || 0,
                variantQuantity,
                detail.quantity || 0,
                price,
                detail.subTotal || 0,
            );
        });
    }

}