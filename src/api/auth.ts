import { api } from './client'
import { setToken } from './token'

export interface AuthUser {
  id: string
  email: string
  name: string
  plan: string
  createdAt?: string
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    '/api/auth/login',
    { email, password },
  )
  setToken(data.token)
  return data
}

export async function register(
  email: string,
  password: string,
  name: string,
) {
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    '/api/auth/register',
    { email, password, name },
  )
  setToken(data.token)
  return data
}

export async function me() {
  const { data } = await api.get<{ user: AuthUser }>('/api/auth/me')
  return data.user
}
