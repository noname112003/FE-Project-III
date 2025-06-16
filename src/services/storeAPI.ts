// src/services/storeAPI.ts
import axios from 'axios';

const apiClients = axios.create({
    baseURL: 'http://localhost:8080/v1/',  // Đặt base URL cho các API
});

export const getStores = async (userId: number) => {
    try {
        // Gọi API để lấy danh sách store theo userId (truyền userId như query parameter)
        const response = await apiClients.get('stores/get_list_store', {
            params: { userId }  // Truyền userId như query parameter
        });

        console.log("Response from getStores:", response.data);  // Kiểm tra dữ liệu trả về
        return response.data;  // Trả về dữ liệu cửa hàng
    } catch (error: any) {
        console.error("Error fetching stores:", error);  // In lỗi chi tiết ra console
        throw new Error(error.response?.data?.message || 'Failed to fetch stores');
    }
};
