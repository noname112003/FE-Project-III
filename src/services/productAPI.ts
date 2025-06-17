import Variant from "../models/Variant";
import {
    ProductRequest,
    ProductResponse,
    VariantRequest,
    VariantResponse,
} from "../models/ProductInterface";
import apiClient from "./api-clients";

const BASE_URL = "http://localhost:8080/v1/products";

const LIMIT = 10;

const getAllVariantsForSearch = async (query: string, storeId: number): Promise<Variant[]> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/variants`, {
            params: {
                page: 0,
                limit: LIMIT,
                query: query,
                storeId: storeId,
            },
        });
        return response.data.data;
    } catch (error) {
        return [];
    }
};

const getListOfProducts = async (
    page: number,
    limit: number,
    query: string,
    storeId: number,
): Promise<ProductResponse[]> => {
    try {
        const response = await apiClient.get(`${BASE_URL}`, {
            params: {
                page: page,
                limit: limit,
                query: query,
                storeId: storeId,
            },
        });
        return response.data.data;
    } catch (error) {
        return [];
    }
};

const getNumberOfProducts = async (query: string): Promise<number> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/total-products`, {
            params: {
                query: query,
            },
        });
        return parseInt(response.data.data);
    } catch (error) {
        return 0;
    }
};

const getProductById = async (
    id: string | undefined,
    storeId: number | null
): Promise<ProductResponse> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`,
        {
            params: {
                storeId: storeId,
            },
        });
    return response.data.data;
};

const createProduct = async (
    product: ProductRequest
): Promise<ProductResponse> => {
    const response = await apiClient.post(`${BASE_URL}/create`, product);
    return response.data.data;
};

const updateProduct = async (
    id: string | undefined,
    product: ProductRequest,
    storeId: number
): Promise<ProductResponse> => {
    const response = await apiClient.put(`${BASE_URL}/${id}/edit`, product, {
        params: {
            storeId: storeId,
        },
    });
    return response.data.data;
};
const deleteProduct = async (id: string | undefined): Promise<any> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data.data;
};

const getListOfVariants = async (
    page: number,
    limit: number,
    query: string,
    storeId: number
): Promise<VariantResponse[]> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/variants`, {
            params: {
                page: page,
                limit: limit,
                query: query,
                storeId: storeId,
            },
        });
        return response.data.data;
    } catch (error) {
        return [];
    }
};

const getNumberOfVariants = async (query: string): Promise<number> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/total-variants`, {
            params: {
                query: query,
            },
        });
        return parseInt(response.data.data);
    } catch (error) {
        return 0;
    }
};

const createVariant = async (
    id: string | undefined,
    variant: VariantRequest
): Promise<VariantResponse> => {
    const response = await apiClient.post(
        `${BASE_URL}/${id}/variants/create`,
        variant
    );
    return response.data.data;
};

const deleteVariantByProperty = async (
    id: string | undefined,
    prop: string | undefined,
    value: string
): Promise<any> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}/variants`, {
        params: {
            prop: prop,
            value: value,
        },
    });
    return response.data.data;
};

export {
    getAllVariantsForSearch,
    getListOfProducts,
    getNumberOfProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getListOfVariants,
    getNumberOfVariants,
    createVariant,
    deleteVariantByProperty,
};
