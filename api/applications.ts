import apiClient from './client';
import { Application } from '@/types/application';
import { ApiError } from '@/types/auth';

interface GetApplicationsResponse {
    success: boolean;
    count: number;
    data: Application[];
}

export const getMyApplications = async (): Promise<Application[]> => {
    try {
        const response = await apiClient.get<GetApplicationsResponse>('/applications/me');
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};
export const getJobApplicants = async (jobId: string): Promise<Application[]> => {
    try {
        const response = await apiClient.get<GetApplicationsResponse>(`/jobs/${jobId}/applications`);
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};