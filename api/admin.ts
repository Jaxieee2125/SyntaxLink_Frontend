// api/admin.ts
import apiClient from './client';

export async function getSystemStats() {
  const { data } = await apiClient.get('/admin/stats');
  return data.data; // { users, problems, submissions, contests, jobs }
}
