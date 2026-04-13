import { api } from './client'

export interface TransactionDto {
  id: string
  asset: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export interface PaginatedTransactions {
  data: TransactionDto[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export async function listTransactions(params: {
  page?: number
  limit?: number
  type?: 'buy' | 'sell'
  search?: string
}) {
  const { data } = await api.get<PaginatedTransactions>(
    '/api/transactions',
    { params },
  )
  return data
}

export async function getTransaction(id: string) {
  const { data } = await api.get<TransactionDto>(`/api/transactions/${id}`)
  return data
}
