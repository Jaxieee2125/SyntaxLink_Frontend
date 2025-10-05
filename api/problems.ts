import apiClient from './client';
import { Problem } from '@/types/problem';
import { ApiError } from '@/types/auth';

interface GetProblemsListResponse {
  success: boolean;
  count: number;
  data: Problem[];
}

interface GetProblemByIdResponse {
  success: boolean;
  data: Problem;
}

export const getProblemById = async (id: string): Promise<Problem> => {
  try {
    const response = await apiClient.get<GetProblemByIdResponse>(`/problems/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

export const getAllProblems = async (): Promise<Problem[]> => {
  try {
    const response = await apiClient.get<GetProblemsListResponse>('/problems');

    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

export const createProblem = async (data: Partial<Problem>) => {
  try {
    const response = await apiClient.post('/problems', data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi từ createProblem:", error?.response?.data || error);
    throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
  }
};

export const updateProblem = async (id: string, data: Partial<Problem>) => {
  await apiClient.put(`/problems/${id}`, data);
};

export const deleteProblem = async (id: string) => {
  await apiClient.delete(`/problems/${id}`);
};