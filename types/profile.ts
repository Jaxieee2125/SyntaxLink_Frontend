import { User } from './user';

// ==========================================================
// ĐỊNH NGHĨA CÁC SUB-TYPE TRƯỚC
// ==========================================================

// Định nghĩa cho một mục Kinh nghiệm làm việc
export interface WorkExperience {
    title: string;
    company: string;
    location?: string;
    from: string; // Sử dụng string vì dữ liệu từ JSON là string
    to?: string;
    current?: boolean;
    description?: string;
}

// Định nghĩa cho một mục Học vấn
export interface Education {
    school: string;
    degree: string;
    fieldOfStudy: string;
    from: string;
    to?: string;
}

// Định nghĩa cho một mục Dự án
export interface Project {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
}

// ==========================================================
// CẬP NHẬT CÁC INTERFACE CHÍNH
// ==========================================================

// Type cho các thông tin có thể chỉnh sửa
// (Không thay đổi nhiều, nhưng đảm bảo nhất quán)
export interface EditableProfile {
    bio?: string;
    skills?: string[];
    social?: {
        github?: string;
        linkedin?: string;
        website?: string;
    };
    // Thêm các mảng này để có thể cập nhật
    experience?: WorkExperience[];
    education?: Education[];
    projects?: Project[];
}

// Type cho dữ liệu profile đầy đủ
// Đây là phần quan trọng nhất cần được cập nhật
export interface DeveloperProfile {
    user: User;
    bio?: string;
    skills?: string[];
    social?: {
        github?: string;
        linkedin?: string;
        website?: string;
    };
    // Thêm các trường mảng vào đây
    experience?: WorkExperience[];
    education?: Education[];
    projects?: Project[];
}

// Type cho dữ liệu thống kê (giữ nguyên)
export interface UserStats {
    problemsSolved: number;
    totalSubmissions: number;
    acceptanceRate: number;
}