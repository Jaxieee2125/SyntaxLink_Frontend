import apiClient from './client';
import { AuthResponse, ApiError } from '@/types/auth';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};
// Thêm hàm register tương tự

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
        // Gửi request đăng ký với vai trò 'developer' được gán cứng
        const response = await apiClient.post<AuthResponse>('/auth/register', {
            name,
            email,
            password,
            role: 'developer' 
        });
        return response.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};