import apiClient from "./api-clients.ts";

export const loginUser = async (phoneNumber: string, password: string) => {
    try {
        const response = await apiClient.post("http://localhost:8080/v1/auth/login", {
            phoneNumber,
            password,
        });
        return response.data;  // Trả về dữ liệu từ API
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Unknown error");
    }
};