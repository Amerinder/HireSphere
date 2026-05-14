import { apiClient } from '../api/client.js'

export async function fetchResumes() {
  const { data } = await apiClient.get('/resumes')
  return data.data
}

export async function uploadResume(file) {
  const formData = new FormData()
  formData.append('resume', file)

  const { data } = await apiClient.post('/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data.data
}

export async function analyzeResume(resumeId, payload = {}) {
  const { data } = await apiClient.post(`/resumes/${resumeId}/analyze`, payload)
  return data.data
}
