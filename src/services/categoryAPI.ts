import apiClient from "./api-clients";
import { CategoryRequest, CategoryResponse } from "../models/ProductInterface";

const BASE_URL = "http://localhost:8080/v1/products/categories";

const INFINITY = 1000000000;

const getAllCategories = async (query: string): Promise<CategoryResponse[]> => {
    try {
        const response = await apiClient.get(BASE_URL, {
            params: {
                page: 0,
                limit: INFINITY,
                query: query,
            },
        });

        return response.data.data;
    } catch (error) {
        return [];
    }
};

const getListOfCategories = async (
    page: number,
    limit: number,
    query: string
): Promise<CategoryResponse[]> => {
    try {
        const response = await apiClient.get(`${BASE_URL}`, {
            params: {
                page: page,
                limit: limit,
                query: query,
            },
        });
        return response.data.data;
    } catch (error) {
        return [];
    }
};

const getNumberOfCategories = async (query: string): Promise<number> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/total-categories`, {
            params: {
                query: query,
            },
        });
        return parseInt(response.data.data);
    } catch (error) {
        return 0;
    }
};

const createCategory = async (
    category: CategoryRequest
): Promise<CategoryResponse> => {
    const response = await apiClient.post(`${BASE_URL}/create`, category);
    return response.data.data;
};

const updateCategory = async (
    id: number | undefined,
    category: CategoryRequest
): Promise<CategoryResponse> => {
    const response = await apiClient.put(`${BASE_URL}/${id}/edit`, category);
    return response.data.data;
};

const deleteCategory = async (id: number | undefined): Promise<any> => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data.data;
};

export {
    getAllCategories,
    getListOfCategories,
    getNumberOfCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
