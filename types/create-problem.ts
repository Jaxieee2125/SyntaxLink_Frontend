// types/create-problem.ts (tách riêng)
export type Difficulty = "Easy"|"Medium"|"Hard";
export interface TestCaseDto { input:string; expectedOutput:string; isSample:boolean; }
export interface CreateProblemDto {
  title:string; description:string; difficulty:Difficulty;
  timeLimit:number; memoryLimit:number; testCases:TestCaseDto[];
}
