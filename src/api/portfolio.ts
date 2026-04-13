import { api } from './client'

export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalReturnPercent: number
}

export interface HoldingDto {
  id: string
  asset: string
  shares: number
  avgBuyPrice: number
  currentPrice: number
  totalValue: number
  pnl: number
  pnlPercent: number
}

export interface HistoryPoint {
  month: string
  value: number
}

export async function getSummary() {
  const { data } = await api.get<PortfolioSummary>('/api/portfolio/summary')
  return data
}

export async function getHoldings() {
  const { data } = await api.get<{ holdings: HoldingDto[] }>(
    '/api/portfolio/holdings',
  )
  return data.holdings
}

export async function getHistory() {
  const { data } = await api.get<{ points: HistoryPoint[] }>(
    '/api/portfolio/history',
  )
  return data.points
}
