export type ContestStatus = 'Upcoming' | 'Running' | 'Finished';

export interface ContestCreator {
  _id: string;
  name: string;
}

export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  creator: {
    _id: string;
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
  problems: {
    problemId: {
      _id: string;
      title: string;
    };
    alias: string;
  }[];
  participants: {
    _id: string;
    name: string;
  }[];
}

export interface CreateContestPayload {
  title: string;
  description: string;
  startTime: string; // gửi lên server dưới dạng ISO string
  endTime: string;
  problems: {
    problemId: string;
    alias: string;
  }[];
}

