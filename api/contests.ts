import apiClient from "./client";
import { Contest, ContestDetail, CreateContestPayload } from "@/types/contest";
import { ApiError } from "@/types/auth";
import { ScoreboardEntry } from "@/types/scoreboard";

interface GetContestsResponse {
  success: boolean;
  data: Contest[];
}

export const getAllContests = async (): Promise<Contest[]> => {
  try {
    const response = await apiClient.get<GetContestsResponse>("/contests");
    const contests = response.data.data;
    return contests.sort(
      (a: Contest, b: Contest) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } catch (error: any) {
    throw error.response?.data ?? { success: false, error: "Lỗi mạng" };
  }
};

interface GetContestResponse {
  success: boolean;
  data: ContestDetail;
}

export const getContestById = async (id: string): Promise<ContestDetail> => {
  try {
    const response = await apiClient.get<GetContestResponse>(`/contests/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: "Lỗi mạng" };
  }
};

interface CreateContestResponse {
  success: boolean;
  data: ContestDetail;
}

export const createContest = async (payload: CreateContestPayload): Promise<ContestDetail> => {
  try {
    const response = await apiClient.post<CreateContestResponse>("/contests", payload);
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: "Lỗi mạng" };
  }
};

interface RegisterResponse {
  success: boolean;
  data: string;
}

export const registerForContest = async (id: string): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(`/contests/${id}/register`);
    return response.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: "Lỗi mạng" };
  }
};

interface GetScoreboardResponse {
  success: boolean;
  data: ScoreboardEntry[];
}

export const getScoreboard = async (id: string): Promise<ScoreboardEntry[]> => {
  try {
    const response = await apiClient.get<GetScoreboardResponse>(`/contests/${id}/scoreboard`);
    return response.data.data;
  } catch (error: any) {
    throw (error.response?.data as ApiError) || { success: false, error: "Lỗi mạng" };
  }
};

export const deleteContest = async (id: string): Promise<string> => {
  try {
    const response = await apiClient.delete<{ success: boolean; data: string }>(`/contests/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data ?? { success: false, error: "Lỗi mạng" };
  }
};

export const updateContest = async (
  id: string,
  payload: CreateContestPayload
): Promise<ContestDetail> => {
  try {
    const response = await apiClient.put<CreateContestResponse>(
      `/contests/${id}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data ?? { success: false, error: "Lỗi mạng" };
  }
};
