export interface JobPosting {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  location: string;
  status: 'open' | 'closed';
  creator: {
    _id: string;
    name: string; // Tên công ty/người đăng
  };
  createdAt: string;
}

export interface ApplicationStatus {
  hasApplied: boolean;
}