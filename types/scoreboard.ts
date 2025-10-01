export interface ScoreboardEntry {
  userId: string;
  name: string;
  problemsSolved: number;
  totalPenalty: number;
  problemStats: {
    [problemId: string]: {
      attempts: number;
      solved: boolean;
      solvedTime: number;
    };
  };
}