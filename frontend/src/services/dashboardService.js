import { apiClient } from '../api/client.js'

export async function fetchDashboardMetrics() {
  const { data } = await apiClient.get('/dashboard')
  return data
}

export async function fetchSavedJobs() {
  const { data } = await apiClient.get('/saved-jobs')
  return data.data
}

export async function saveJob(jobId) {
  const { data } = await apiClient.post(`/jobs/${jobId}/save`)
  return data
}

export async function unsaveJob(jobId) {
  const { data } = await apiClient.delete(`/jobs/${jobId}/save`)
  return data
}
