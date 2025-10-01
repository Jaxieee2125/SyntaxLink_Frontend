export interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;   // in seconds
  memoryLimit: number; // in MB
  description: string;
  // Thêm các trường khác nếu cần hiển thị trên list
}