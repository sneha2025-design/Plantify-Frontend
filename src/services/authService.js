import api from './api'

function persistSession(data) {
  if (data.token) {
    localStorage.setItem('plantify_token', data.token)
    localStorage.setItem('plantify_user', JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    }))
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('plantify_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isAdmin() {
  return getCurrentUser()?.role === 'ADMIN'
}

export async function loginUser({ identifier, password }) {
  const { data } = await api.post('/auth/login', { identifier, password })
  persistSession(data)
  return data
}

export async function registerUser({ fullName, email, mobileNumber, password, confirmPassword }) {
  const { data } = await api.post('/auth/register', {
    fullName,
    email,
    mobileNumber,
    password,
    confirmPassword,
  })
  return data
}

export async function loginWithGoogleToken(accessToken) {
  const { data } = await api.post('/auth/google', { accessToken })
  if (data.token) {
    localStorage.setItem('plantify_token', data.token)
  }
  return data
}

// --- Forgot password (OTP flow: request -> verify -> reset) ---

export async function requestOtp(email) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

export async function verifyOtp(email, otp) {
  const { data } = await api.post('/auth/verify-otp', { email, otp })
  return data // { message, resetToken }
}

export async function resetPassword({ token, newPassword, confirmPassword }) {
  const { data } = await api.post('/auth/reset-password', { token, newPassword, confirmPassword })
  return data
}

// --- Authenticated account actions ---

export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
  const { data } = await api.put('/auth/change-password', {
    currentPassword,
    newPassword,
    confirmPassword,
  })
  return data
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout')
  } finally {
    localStorage.removeItem('plantify_token')
  }
}
