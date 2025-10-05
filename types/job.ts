// types/job.ts
export type Moderation = 'pending' | 'approved' | 'rejected';

export interface JobPosting {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  location: string;
  status: 'open' | 'closed';
  creator: { _id: string; name: string };
  createdAt: string;
  difficulty: string | null;

  // thêm duyệt
  moderationStatus: Moderation;          // NEW
  approvedBy?: { _id: string; name: string }; // optional
  approvedAt?: string;                    // ISO time
}

export interface ApplicationStatus {
  hasApplied: boolean;
}
