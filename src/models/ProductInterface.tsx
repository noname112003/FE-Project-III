export interface ProductResponse {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    brandId: number;
    brandName: string;
    description: string;
    totalQuantity: number;
    status: boolean;
    size: string[];
    color: string[];
    material: string[];
    imagePath: string[];
    createdOn: Date;
    updatedOn: Date;
    variants: VariantResponse[];
}

export const initialProductResponse = {
    id: 0,
    name: "",
    categoryId: 0,
    categoryName: "",
    brandId: 0,
    brandName: "",
    description: "",
    totalQuantity: 0,
    status: false,
    size: [],
    color: [],
    material: [],
    imagePath: [],
    createdOn: new Date(),
    updatedOn: new Date(),
    variants: [],
};
export interface VariantStore {
    storeId: number;
    quantity: number;
}
export interface VariantResponse {
    id: number;
    name: string;
    productId: number;
    productName: string;
    sku: string;
    quantity: number;
    status: boolean;
    size: string;
    color: string;
    material: string;
    imagePath: string;
    createdOn: Date;
    updatedOn: Date;
    initialPrice: number;
    priceForSale: number;
    variantStores: VariantStore[];
}

export const initialVariantResponse = {
    id: 0,
    name: "",
    productId: 0,
    productName: "",
    sku: "",
    quantity: 0,
    status: true,
    size: "",
    color: "",
    material: "",
    imagePath: "",
    initialPrice: 0,
    priceForSale: 0,
    createdOn: new Date(),
    updatedOn: new Date(),
    variantStores: [],
};

export interface ProductRequest {
    name: string;
    categoryId: number;
    brandId: number;
    description: string;
    imagePath: string[] | [];
    createdOn: Date;
    updatedOn: Date;
    totalQuantity: number;
    status: boolean;
    variants: VariantRequest[];
}
export const initialProductRequest = {
    name: "",
    categoryId: 0,
    brandId: 0,
    description: "",
    imagePath: [],
    createdOn: new Date(),
    updatedOn: new Date(),
    totalQuantity: 0,
    variants: [],
    status: true,
};

export interface VariantRequest {
    id?: number;
    name: string;
    productId?: number;
    quantity: number;
    sku: string;
    size: string;
    color: string;
    material: string;
    imagePath: string | "";
    initialPrice: number;
    priceForSale: number;
    status: boolean;
    variantStores: VariantStore[];
}

export const initialVariantRequest = {
    id: 0,
    name: "",
    productId: 0,
    quantity: 0,
    sku: "",
    size: "",
    color: "",
    material: "",
    imagePath: "",
    initialPrice: 0,
    priceForSale: 0,
    status: true,
    variantStores: [],
};

export interface CategoryResponse {
    id: number;
    name: string;
    code: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
}

export const initialCategoryOrBrandResponse = {
    id: 0,
    name: "",
    code: "",
    description: "",
    createdOn: new Date(),
    updatedOn: new Date(),
};

export interface CategoryRequest {
    id?: number;
    name: string;
    code: string;
    description: string;
}

export interface BrandResponse {
    id: number;
    name: string;
    code: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
}

export interface BrandRequest {
    id?: number;
    name: string;
    code: string;
    description: string;
}
