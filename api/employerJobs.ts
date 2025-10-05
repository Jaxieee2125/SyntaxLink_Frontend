import apiClient from './client';
import { JobPosting } from '@/types/job';

// lấy job của employer:
// lấy job của employer:
export async function getEmployerJobs(): Promise<{ data: JobPosting[]; success: boolean }> {
  const url = "/jobs/mine";
  console.log("[getEmployerJobs] Gửi yêu cầu đến:", apiClient.defaults.baseURL + url);

  try {
    const { data } = await apiClient.get(url);
    console.log("[getEmployerJobs] Nhận được dữ liệu:", data);
    return data; // data có dạng { data: [...], success: true }
  } catch (err: any) {
    console.error("[getEmployerJobs] LỖI:", err?.message);
    if (err?.response) {
      console.error("[getEmployerJobs] status:", err.response.status);
      console.error("[getEmployerJobs] response:", err.response.data);
    }
    throw err;
  }
}



// xóa job của employer:
export async function deleteEmployerJob(id: string) {
  return apiClient.delete(`/jobs/${id}`); // employer/admin có quyền
}

// tạo job mới:
export async function createEmployerJob(payload: {
  title: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  location: string;
}): Promise<JobPosting> {
  const { data } = await apiClient.post('/jobs', payload); // employer có quyền POST /jobs
  return data.data ?? data;
}

// update job:
export async function updateEmployerJob(id: string, payload: Partial<{
  title: string; description: string; requirements: string[]; salaryRange?: string; location: string; status: 'open'|'closed';
}>): Promise<JobPosting> {
  const { data } = await apiClient.put(`/jobs/${id}`, payload);
  return data.data ?? data;
}

// lấy job theo id:
export async function getEmployerJobById(id: string): Promise<JobPosting> {
  const { data } = await apiClient.get(`/jobs/${id}`);
  return data.data ?? data;
}
