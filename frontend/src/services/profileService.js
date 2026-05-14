import { apiClient } from '../api/client.js'

export async function fetchProfile() {
  const { data } = await apiClient.get('/profile')
  return data.data
}

export async function updateProfile(payload) {
  const { data } = await apiClient.put('/profile', payload)
  return data.data
}
