import axios from 'axios'
import { getToken } from './token'

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3001'

export const api = axios.create({
  baseURL,
  timeout: 12_000,
})

api.interceptors.request.use((config) => {
  const t = getToken()
  if (t) {
    config.headers.Authorization = `Bearer ${t}`
  }
  return config
})

export function isApiNetworkError(err: unknown): boolean {
  return axios.isAxiosError(err) && !err.response
}
