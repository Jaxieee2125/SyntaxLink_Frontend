import apiClient from './client';
import { JobPosting, ApplicationStatus } from '@/types/job';
import { ApiError } from '@/types/auth';

interface GetJobsResponse {
  success: boolean;
  count: number;
  data: JobPosting[];
}

// Thêm interface mới
interface GetJobResponse {
  success: boolean;
  data: JobPosting;
}

interface JobSearchParams {
    search?: string;
    location?: string;
}

export const getAllJobs = async (params: JobSearchParams = {}): Promise<JobPosting[]> => {
  try {
    const response = await apiClient.get<GetJobsResponse>('/jobs', {
        params: params // Axios sẽ tự động chuyển object này thành query string
    });
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

export const getJobById = async (id: string): Promise<JobPosting> => {
  try {
    const response = await apiClient.get<GetJobResponse>(`/jobs/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

// === HÀM ỨNG TUYỂN VÀO MỘT JOB ===
interface ApplyResponse { success: boolean; data: any; }
export const applyForJob = async (jobId: string): Promise<ApplyResponse> => {
    try {
        const response = await apiClient.post<ApplyResponse>(`/jobs/${jobId}/apply`);
        return response.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
}

// === HÀM KIỂM TRA TRẠNG THÁI ĐÃ ỨNG TUYỂN CHƯA ===
interface StatusResponse { success: boolean; data: ApplicationStatus; }
export const checkApplicationStatus = async (jobId: string): Promise<ApplicationStatus> => {
    try {
        const response = await apiClient.get<StatusResponse>(`/jobs/${jobId}/application-status`);
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
}