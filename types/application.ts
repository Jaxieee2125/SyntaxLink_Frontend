import { JobPosting } from './job';

export type ApplicationStatusValue = 'submitted' | 'viewed' | 'interview' | 'offered' | 'rejected' | 'hired';

export interface Application {
    _id: string;
    jobId: JobPosting; // Sẽ là object Job đầy đủ nhờ .populate()
    applicantId: string;
    status: ApplicationStatusValue;
    createdAt: string;
}