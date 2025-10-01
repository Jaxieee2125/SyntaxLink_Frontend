export type SubmissionStatus = 
  | 'Pending' 
  | 'Judging' 
  | 'Accepted' 
  | 'Wrong Answer' 
  | 'Time Limit Exceeded' 
  | 'Compilation Error' 
  | 'Runtime Error';

export interface Submission {
  _id: string;
  status: SubmissionStatus;
  language: string;
  code: string; // <-- Thêm mã nguồn
  executionTime?: number; // <-- Thêm thời gian thực thi
  memoryUsed?: number; // <-- Thêm bộ nhớ sử dụng
  createdAt: string;
  problemId: {
    _id: string;
    title: string;
  };
}
  // Thêm các trường khác nếu cần, ví dụ: executionTime, memoryUsed