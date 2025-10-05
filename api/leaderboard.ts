import apiClient from './client';
import { LeaderboardEntry } from '@/types/leaderboard';
import { ApiError } from '@/types/auth';

interface GetLeaderboardResponse {
    success: boolean;
    data: LeaderboardEntry[];
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
        const response = await apiClient.get<GetLeaderboardResponse>('/leaderboard');
        return response.data.data;
    } catch (error: any) {
        throw (error.response?.data as ApiError) || { success: false, error: 'Lỗi mạng' };
    }
};