import axios from 'axios';
import apiClient from './api-clients';

const BASE_URL = 'http://localhost:8080/v1/orders';

const getAllOrders = async (page: number, limit: number, query: string, startDate: string, endDate: string, storeId: number): Promise<any> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/`, {
            params: {
                page: page,
                limit: limit,
                query: query,
                startDate: startDate,
                endDate: endDate,
                storeId: storeId
            }
        });
        return response.data;
    } catch (error) {
        return [];
    }
}

const getNumberOfOrders = async (query: string, startDate: string, endDate: string,  storeId: number): Promise<any> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/count`, {
            params: {
                query: query,
                startDate: startDate,
                endDate: endDate,
                storeId: storeId
            }
        });
        return response.data;
    } catch (error) {
        return 0;
    }
}

const getOrderDetail = async (orderCode: string | undefined): Promise<any> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/${orderCode}`);
        return response.data;
    } catch (error) {
        return null;
    }
}
const getOrderDetailV2 = async (orderCode: string | undefined): Promise<any> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/v2/${orderCode}`);
        return response.data;
    } catch (error) {
        return null;
    }
}

const createOrder = async (order: any): Promise<any> => {
    return await apiClient.post(`${BASE_URL}/create`, order);
}

const updateOrder = async (order: any, id: number | undefined): Promise<any> => {
    return await apiClient.put(`${BASE_URL}/update/${id}`, order);
}
const getTodayOrders = async (storeId: number, pageNum: number, pageSize: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/today`, {
            params: {
                storeId: storeId,
                pageNum: pageNum,
                pageSize: pageSize
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        throw error;
    }
};


export interface CreatePaymentLinkRequestBody {
    productName: string;
    description: string;
    returnUrl: string;
    price: number;
    cancelUrl: string;
}

const createPaymentLink = async (body: CreatePaymentLinkRequestBody) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-payment-link`, body);
        return response.data;
    } catch (error: any) {
        console.error('Failed to create payment link:', error);
        throw error;
    }
};
const getPaymentLink = async (orderId: number) => {
    const response = await axios.get(`${BASE_URL}/get-payos/${orderId}`);
    return response.data;
};

const cancelPaymentLink = async (orderId: number) => {
    const response = await axios.put(`${BASE_URL}/${orderId}`);
    return response.data;
};
export { createOrder, getAllOrders, getNumberOfOrders, getOrderDetail, getTodayOrders, getOrderDetailV2, updateOrder, createPaymentLink, getPaymentLink, cancelPaymentLink };
