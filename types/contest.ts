export type ContestStatus = 'Upcoming' | 'Running' | 'Finished';

export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  creator: {
    name: string;
  };
}

// Type cho một bài toán bên trong cuộc thi
export interface ContestProblem {
  problemId: {
    _id: string;
    title: string;
  };
  alias: string; // Ví dụ: 'A', 'B'
}

// Type chi tiết cho một cuộc thi
export interface ContestDetail extends Contest {
  problems: ContestProblem[];
  participants: string[]; // Mảng các ID của người tham gia
}