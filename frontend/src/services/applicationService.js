import { apiClient } from '../api/client.js'

export async function applyToJob(jobId, payload) {
  const { data } = await apiClient.post(`/jobs/${jobId}/applications`, payload)
  return data.data
}

export async function fetchMyApplications() {
  const { data } = await apiClient.get('/applications/me')
  return data.data
}

export async function fetchJobApplications(jobId) {
  const { data } = await apiClient.get(`/jobs/${jobId}/applications`)
  return data.data
}

export async function updateApplicationStatus(applicationId, status) {
  const { data } = await apiClient.patch(`/applications/${applicationId}/status`, { status })
  return data.data
}
