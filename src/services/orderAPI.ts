import axios from 'axios';
import apiClient from './api-clients';

const BASE_URL = 'https://be-project-iii.onrender.com/v1/orders';

const getAllOrders = async (page: number, limit: number, query: string, startDate: string, endDate: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/`, {
            params: {
                page: page,
                limit: limit,
                query: query,
                startDate: startDate,
                endDate: endDate
            }
        });
        return response.data;
    } catch (error) {
        return [];
    }
}

const getNumberOfOrders = async (query: string, startDate: string, endDate: string): Promise<any> => {
    try {
        const response = await apiClient.get(`${BASE_URL}/count`, {
            params: {
                query: query,
                startDate: startDate,
                endDate: endDate
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

const createOrder = async (order: any): Promise<any> => {
    return await apiClient.post(`${BASE_URL}/create`, order);
}
const getTodayOrders = async (pageNum: number, pageSize: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/today`, {
            params: {
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

export { createOrder, getAllOrders, getNumberOfOrders, getOrderDetail, getTodayOrders };
