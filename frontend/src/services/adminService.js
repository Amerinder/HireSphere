import { apiClient } from '../api/client.js'

export async function fetchAdminAnalytics() {
  const { data } = await apiClient.get('/admin/analytics')
  return data
}

export async function fetchAdminUsers(params = {}) {
  const { data } = await apiClient.get('/admin/users', { params })
  return data.data
}
