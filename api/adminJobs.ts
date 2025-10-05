// api/adminJobs.ts
import apiClient from './client';
import { JobPosting, Moderation } from '@/types/job';

// Danh sách job admin
export async function adminListJobs(params?: { q?: string; status?: Moderation; page?: number; limit?: number }) {
  try {
    console.log('[adminListJobs] 🔍 Params:', params);
    const { data } = await apiClient.get('/admin/jobs', { params });
    console.log('[adminListJobs] ✅ Response:', data);
    return data; // { items, total, page, limit }
  } catch (err: any) {
    console.error('[adminListJobs] ❌ Error:', err.response?.status, err.response?.data, err.config?.url);
    throw err;
  }
}

// Lấy chi tiết 1 job
export async function adminGetJob(id: string): Promise<JobPosting> {
  try {
    console.log('[adminGetJob] 🔍 ID:', id);
    const { data } = await apiClient.get(`/admin/jobs/${id}`);
    console.log('[adminGetJob] ✅ Response:', data);
    return data.data ?? data;
  } catch (err: any) {
    console.error('[adminGetJob] ❌ Error:', err.response?.status, err.response?.data, err.config?.url);
    throw err;
  }
}

// Duyệt hoặc từ chối
export async function adminApproveJob(id: string, decision: 'approved' | 'rejected') {
  try {
    console.log('[adminApproveJob] 🔍 ID:', id, '| Decision:', decision);
    const { data } = await apiClient.patch(`/admin/jobs/${id}/approve`, { decision });
    console.log('[adminApproveJob] ✅ Response:', data);
    return data.data ?? data;
  } catch (err: any) {
    console.error('[adminApproveJob] ❌ Error:', err.response?.status, err.response?.data, err.config?.url);
    throw err;
  }
}

// Xoá job
export async function adminDeleteJob(id: string) {
  try {
    console.log('[adminDeleteJob] 🔍 ID:', id);
    const res = await apiClient.delete(`/admin/jobs/${id}`);
    console.log('[adminDeleteJob] ✅ Deleted:', res.status);
  } catch (err: any) {
    console.error('[adminDeleteJob] ❌ Error:', err.response?.status, err.response?.data, err.config?.url);
    throw err;
  }
}
