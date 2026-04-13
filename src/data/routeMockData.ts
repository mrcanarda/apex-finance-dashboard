/**
 * Mock data for routed pages (portfolio, markets, full transaction history).
 */

import type { TransactionStatus, TransactionType } from './mockData'

/** Single position in the portfolio holdings table */
export interface Holding {
  asset: string
  shares: number
  avgBuyPrice: number
  currentPrice: number
  totalValue: number
  pnl: number
  pnlPercent: number
  category: 'stock' | 'crypto'
}

/** Point for portfolio bar chart (P&L by asset) */
export interface HoldingPerformance {
  asset: string
  pnl: number
}

export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalReturnPercent: number
}

export type MarketCategory = 'stock' | 'crypto'

/** Card in the markets overview grid */
export interface MarketAsset {
  ticker: string
  name: string
  price: number
  change24hPercent: number
  marketCap: number
  category: MarketCategory
  sparkline: number[]
}

/** Extended row for full transaction history page */
export interface TransactionDetail {
  id: string
  asset: string
  type: TransactionType
  amount: number
  price: number
  total: number
  fee: number
  date: string
  status: TransactionStatus
  reference: string
}

function spark(seed: number, n = 16): number[] {
  const out: number[] = []
  let v = 0.45 + (seed % 5) * 0.02
  for (let i = 0; i < n; i++) {
    v += Math.sin(i * 0.5 + seed * 0.1) * 0.07
    v = Math.max(0.1, Math.min(0.95, v))
    out.push(v)
  }
  return out
}

/** 10 holdings — stocks + crypto */
export const holdings: Holding[] = [
  {
    asset: 'NVDA',
    shares: 48,
    avgBuyPrice: 92.4,
    currentPrice: 128.42,
    totalValue: 48 * 128.42,
    pnl: 48 * 128.42 - 48 * 92.4,
    pnlPercent: ((128.42 - 92.4) / 92.4) * 100,
    category: 'stock',
  },
  {
    asset: 'AAPL',
    shares: 120,
    avgBuyPrice: 198.1,
    currentPrice: 241.18,
    totalValue: 120 * 241.18,
    pnl: 120 * 241.18 - 120 * 198.1,
    pnlPercent: ((241.18 - 198.1) / 198.1) * 100,
    category: 'stock',
  },
  {
    asset: 'BTC',
    shares: 1.85,
    avgBuyPrice: 62400,
    currentPrice: 97240,
    totalValue: 1.85 * 97240,
    pnl: 1.85 * 97240 - 1.85 * 62400,
    pnlPercent: ((97240 - 62400) / 62400) * 100,
    category: 'crypto',
  },
  {
    asset: 'MSFT',
    shares: 22,
    avgBuyPrice: 380.0,
    currentPrice: 438.9,
    totalValue: 22 * 438.9,
    pnl: 22 * 438.9 - 22 * 380.0,
    pnlPercent: ((438.9 - 380) / 380) * 100,
    category: 'stock',
  },
  {
    asset: 'ETH',
    shares: 14.2,
    avgBuyPrice: 2650,
    currentPrice: 3420,
    totalValue: 14.2 * 3420,
    pnl: 14.2 * 3420 - 14.2 * 2650,
    pnlPercent: ((3420 - 2650) / 2650) * 100,
    category: 'crypto',
  },
  {
    asset: 'TSLA',
    shares: 35,
    avgBuyPrice: 410.2,
    currentPrice: 352.1,
    totalValue: 35 * 352.1,
    pnl: 35 * 352.1 - 35 * 410.2,
    pnlPercent: ((352.1 - 410.2) / 410.2) * 100,
    category: 'stock',
  },
  {
    asset: 'AMD',
    shares: 200,
    avgBuyPrice: 108.4,
    currentPrice: 124.6,
    totalValue: 200 * 124.6,
    pnl: 200 * 124.6 - 200 * 108.4,
    pnlPercent: ((124.6 - 108.4) / 108.4) * 100,
    category: 'stock',
  },
  {
    asset: 'GOOGL',
    shares: 55,
    avgBuyPrice: 142.0,
    currentPrice: 178.45,
    totalValue: 55 * 178.45,
    pnl: 55 * 178.45 - 55 * 142.0,
    pnlPercent: ((178.45 - 142) / 142) * 100,
    category: 'stock',
  },
  {
    asset: 'SOL',
    shares: 420,
    avgBuyPrice: 118.0,
    currentPrice: 142.3,
    totalValue: 420 * 142.3,
    pnl: 420 * 142.3 - 420 * 118.0,
    pnlPercent: ((142.3 - 118) / 118) * 100,
    category: 'crypto',
  },
  {
    asset: 'META',
    shares: 18,
    avgBuyPrice: 520.0,
    currentPrice: 612.8,
    totalValue: 18 * 612.8,
    pnl: 18 * 612.8 - 18 * 520.0,
    pnlPercent: ((612.8 - 520) / 520) * 100,
    category: 'stock',
  },
].map((h) => ({
  ...h,
  category: h.category as Holding['category'],
  totalValue: Math.round(h.totalValue * 100) / 100,
  pnl: Math.round(h.pnl * 100) / 100,
  pnlPercent: Math.round(h.pnlPercent * 100) / 100,
})) as Holding[]

export const portfolioSummary: PortfolioSummary = (() => {
  const totalInvested = holdings.reduce(
    (s, h) => s + h.shares * h.avgBuyPrice,
    0,
  )
  const currentValue = holdings.reduce((s, h) => s + h.totalValue, 0)
  const totalReturnPercent =
    ((currentValue - totalInvested) / totalInvested) * 100
  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalReturnPercent: Math.round(totalReturnPercent * 100) / 100,
  }
})()

export const holdingPerformance: HoldingPerformance[] = holdings.map(
  (h) => ({
    asset: h.asset,
    pnl: Math.round(h.pnl * 100) / 100,
  }),
)

/** 12 liquid names for markets grid */
export const marketAssets: MarketAsset[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 241.18,
    change24hPercent: 0.64,
    marketCap: 3_650_000_000_000,
    category: 'stock',
    sparkline: spark(1),
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft',
    price: 438.9,
    change24hPercent: 1.12,
    marketCap: 3_280_000_000_000,
    category: 'stock',
    sparkline: spark(2),
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA',
    price: 128.42,
    change24hPercent: 3.82,
    marketCap: 3_150_000_000_000,
    category: 'stock',
    sparkline: spark(3),
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet',
    price: 178.45,
    change24hPercent: -0.31,
    marketCap: 2_210_000_000_000,
    category: 'stock',
    sparkline: spark(4),
  },
  {
    ticker: 'AMZN',
    name: 'Amazon',
    price: 212.3,
    change24hPercent: 0.88,
    marketCap: 2_180_000_000_000,
    category: 'stock',
    sparkline: spark(5),
  },
  {
    ticker: 'TSLA',
    name: 'Tesla',
    price: 352.1,
    change24hPercent: -2.14,
    marketCap: 1_120_000_000_000,
    category: 'stock',
    sparkline: spark(6),
  },
  {
    ticker: 'META',
    name: 'Meta',
    price: 612.8,
    change24hPercent: 1.05,
    marketCap: 1_540_000_000_000,
    category: 'stock',
    sparkline: spark(7),
  },
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    price: 97240,
    change24hPercent: 1.95,
    marketCap: 1_920_000_000_000,
    category: 'crypto',
    sparkline: spark(8),
  },
  {
    ticker: 'ETH',
    name: 'Ethereum',
    price: 3420,
    change24hPercent: -1.22,
    marketCap: 410_000_000_000,
    category: 'crypto',
    sparkline: spark(9),
  },
  {
    ticker: 'SOL',
    name: 'Solana',
    price: 142.3,
    change24hPercent: 4.1,
    marketCap: 68_000_000_000,
    category: 'crypto',
    sparkline: spark(10),
  },
  {
    ticker: 'AMD',
    name: 'AMD',
    price: 124.6,
    change24hPercent: -0.45,
    marketCap: 200_000_000_000,
    category: 'stock',
    sparkline: spark(11),
  },
  {
    ticker: 'COIN',
    name: 'Coinbase',
    price: 318.4,
    change24hPercent: 2.33,
    marketCap: 78_000_000_000,
    category: 'stock',
    sparkline: spark(12),
  },
]

const TX_ASSETS = [
  'AAPL',
  'MSFT',
  'NVDA',
  'TSLA',
  'BTC',
  'ETH',
  'GOOGL',
  'META',
  'AMD',
  'SOL',
  'AMZN',
  'COIN',
] as const

/** 30 synthetic transactions for history page */
export const transactionsFull: TransactionDetail[] = Array.from(
  { length: 30 },
  (_, i) => {
    const asset = TX_ASSETS[i % TX_ASSETS.length]
    const type: TransactionType = i % 3 === 0 ? 'Sell' : 'Buy'
    const amount = type === 'Buy' ? 4 + (i % 8) : 2 + (i % 5)
    const price =
      asset === 'BTC'
        ? 92000 + i * 400
        : asset === 'ETH'
          ? 3200 + i * 12
          : 80 + i * 3.5
    const total = Math.round(amount * price * 100) / 100
    const fee = Math.round(total * 0.0008 * 100) / 100
    const statuses: TransactionStatus[] = [
      'Completed',
      'Completed',
      'Completed',
      'Pending',
      'Failed',
    ]
    const status = statuses[i % statuses.length]
    const day = String(31 - (i % 28)).padStart(2, '0')
    const month = String(1 + (i % 4)).padStart(2, '0')
    return {
      id: `tx-${i + 1}`,
      asset,
      type,
      amount,
      price: Math.round(price * 100) / 100,
      total,
      fee,
      date: `2026-${month}-${day}`,
      status,
      reference: `APEX-2026-${1000 + i}`,
    }
  },
)
