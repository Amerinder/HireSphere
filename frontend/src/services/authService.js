import { apiClient } from '../api/client.js'

export async function requestLoginOtp(payload) {
  const { data } = await apiClient.post('/auth/otp', payload)
  return data
}

export async function verifyLoginOtp(payload) {
  const { data } = await apiClient.post('/auth/otp/verify', payload)
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data.data
}

export async function logoutUser() {
  await apiClient.post('/auth/logout')
}
