import { apiClient } from '../api/client.js'

export async function requestMagicLink(payload) {
  const { data } = await apiClient.post('/auth/magic-link', payload)
  return data
}

export async function verifyMagicLink(payload) {
  const { data } = await apiClient.post('/auth/magic-link/verify', payload)
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data.data
}

export async function logoutUser() {
  await apiClient.post('/auth/logout')
}
