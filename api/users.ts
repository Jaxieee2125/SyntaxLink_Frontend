
// api/users.ts
import apiClient from './client';
export const listUsers = async () => (await apiClient.get('/users')).data.data;
export const getUser = async (id:string) => (await apiClient.get(`/users/${id}`)).data.data;
export const updateUser = async (id:string, payload:{name?:string;role?:'developer'|'employer'|'admin'}) =>
  (await apiClient.put(`/users/${id}`, payload)).data.data;
export const deleteUser = async (id:string) => (await apiClient.delete(`/users/${id}`)).data.success;
