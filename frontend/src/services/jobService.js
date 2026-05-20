import { apiClient } from '../api/client.js'

export async function fetchJobs(params = {}) {
  const { data } = await apiClient.get('/jobs', { params })
  return data
}

export async function fetchJob(id) {
  const { data } = await apiClient.get(`/jobs/${id}`)
  return data.data
}

export async function createJob(payload) {
  const { data } = await apiClient.post('/jobs', payload)
  return data.data
}

export async function fetchRecruiterJobs() {
  const { data } = await apiClient.get('/recruiter/jobs', { params: { mine: true, per_page: 50 } })
  return data.data
}

export async function deleteJob(id) {
  await apiClient.delete(`/jobs/${id}`)
}
