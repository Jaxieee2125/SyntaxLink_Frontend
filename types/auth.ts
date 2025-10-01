import { User } from './user'; // Giả sử file user.ts nằm cùng thư mục

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User; // Dòng này giờ đã hợp lệ
}

export interface ApiError {
    success: boolean;
    error: string;
}