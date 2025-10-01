import apiClient from './client';
import { ApiError } from '@/types/auth';
import { Submission } from '@/types/submission';

interface SubmitResponse {
  success: boolean;
  submissionId: string;
}

export const submitSolution = async (problemId: string, code: string, language: string, contestId?: string): Promise<SubmitResponse> => {
  try {
    const payload: { problemId: string; code: string; language: string; contestId?: string } = {
      problemId,
      code,
      language,
    };
    if (contestId) {
      payload.contestId = contestId;
    }
    const response = await apiClient.post<SubmitResponse>('/submissions', payload);
    return response.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

interface GetSubmissionsResponse {
  success: boolean;
  count: number;
  data: Submission[];
}

export const getSubmissionsByProblem = async (problemId: string): Promise<Submission[]> => {
  try {
    const response = await apiClient.get<GetSubmissionsResponse>(`/submissions`, {
      params: { problemId } // Gửi problemId dưới dạng query params
    });
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

interface GetSubmissionResponse {
  success: boolean;
  data: Submission;
}

export const getSubmissionById = async (id: string): Promise<Submission> => {
  try {
    const response = await apiClient.get<GetSubmissionResponse>(`/submissions/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};