import apiClient from './client';
import { DeveloperProfile, EditableProfile, UserStats } from '@/types/profile';
import { ApiError } from '@/types/auth';
import * as FileSystem from 'expo-file-system/legacy';

interface ProfileResponse {
    success: boolean;
    data: DeveloperProfile;
}

interface StatsResponse {
    success: boolean;
    data: UserStats;
}

export const getMyProfile = async (): Promise<DeveloperProfile> => {
    try {
        const response = await apiClient.get<ProfileResponse>('/profile/me');
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};

export const getMyStats = async (): Promise<UserStats> => {
    try {
        const response = await apiClient.get<StatsResponse>('/profile/me/stats');
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};

export const updateMyProfile = async (profileData: EditableProfile): Promise<DeveloperProfile> => {
    try {
        // API này dùng phương thức POST theo thiết kế backend
        const response = await apiClient.post<ProfileResponse>('/profile', profileData);
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};

export const downloadMyCv = async (token: string, userName: string): Promise<string> => {
    // Axios không xử lý file tốt, ta dùng FileSystem của Expo
    const fileName = `CV_${userName.replace(/\s/g, '_')}.pdf`;
    const fileUri = FileSystem.documentDirectory + fileName;
    
    try {
        const { uri } = await FileSystem.downloadAsync(
            `${apiClient.defaults.baseURL}/profile/me/cv`,
            fileUri,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return uri;
    } catch (error) {
        console.error("Download CV Error:", error);
        throw new Error("Không thể tải CV.");
    }
};
export const getProfileByUserId = async (userId: string): Promise<DeveloperProfile> => {
    try {
        const response = await apiClient.get<ProfileResponse>(`/profile/user/${userId}`);
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};