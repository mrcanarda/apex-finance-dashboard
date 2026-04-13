import { api } from './client'

export interface MarketAssetDto {
  id: string
  symbol: string
  name: string
  type: 'stock' | 'crypto'
  price: number
  change24h: number
  changePercent24h: number
  marketCap: number
  volume: number
}

export async function listMarkets(type?: 'stock' | 'crypto') {
  const { data } = await api.get<{ assets: MarketAssetDto[] }>(
    '/api/markets',
    { params: type ? { type } : undefined },
  )
  return data.assets
}

export async function getMarket(symbol: string) {
  const { data } = await api.get<MarketAssetDto>(`/api/markets/${symbol}`)
  return data
}
