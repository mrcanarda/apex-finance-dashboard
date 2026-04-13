/**
 * Mock financial data for the dashboard — all values are fictional.
 */

/** Single point on the portfolio value time series */
export interface PortfolioPoint {
  month: string
  value: number
}

/** Slice for allocation donut */
export interface AllocationSlice {
  name: string
  value: number
  color: string
}

export type TransactionType = 'Buy' | 'Sell'

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed'

export interface Transaction {
  id: string
  asset: string
  type: TransactionType
  amount: number
  price: number
  date: string
  status: TransactionStatus
}

export interface TopMover {
  ticker: string
  companyName: string
  price: number
  changePercent: number
  /** Normalized 0–1 series for sparkline shape */
  sparkline: number[]
}

export type KPIFormat = 'currency' | 'percent' | 'number'

export interface KPIConfig {
  id: string
  label: string
  value: number
  format: KPIFormat
  /** Optional subtitle or hint */
  hint?: string
  /** For currency formatting (default 0 for whole dollars) */
  fractionDigits?: number
}

/** Curated donut palette per spec */
export const ALLOCATION_COLORS = [
  '#F0A500',
  '#3B82F6',
  '#22C55E',
  '#A855F7',
  '#EF4444',
] as const

/** 12 months of portfolio value — growth with volatility */
export const portfolioHistory: PortfolioPoint[] = [
  { month: 'Jan', value: 218_400 },
  { month: 'Feb', value: 224_100 },
  { month: 'Mar', value: 219_800 },
  { month: 'Apr', value: 231_200 },
  { month: 'May', value: 228_900 },
  { month: 'Jun', value: 241_500 },
  { month: 'Jul', value: 246_200 },
  { month: 'Aug', value: 239_100 },
  { month: 'Sep', value: 252_800 },
  { month: 'Oct', value: 261_400 },
  { month: 'Nov', value: 276_300 },
  { month: 'Dec', value: 284_520 },
]

export const allocation: AllocationSlice[] = [
  { name: 'US Equities', value: 38, color: ALLOCATION_COLORS[0] },
  { name: 'Tech Growth', value: 24, color: ALLOCATION_COLORS[1] },
  { name: 'Fixed Income', value: 15, color: ALLOCATION_COLORS[2] },
  { name: 'Crypto', value: 12, color: ALLOCATION_COLORS[3] },
  { name: 'Commodities', value: 11, color: ALLOCATION_COLORS[4] },
]

export const kpiMetrics: KPIConfig[] = [
  {
    id: 'balance',
    label: 'Total Balance',
    value: 284_520,
    format: 'currency',
    hint: 'Across all accounts',
  },
  {
    id: 'pnl',
    label: 'Monthly P&L',
    value: 12_847.32,
    format: 'currency',
    fractionDigits: 2,
    hint: 'Mar 1 — Mar 31',
  },
  {
    id: 'assets',
    label: 'Active Assets',
    value: 47,
    format: 'number',
    hint: 'Positions tracked',
  },
  {
    id: 'change',
    label: 'Portfolio Change',
    value: 4.28,
    format: 'percent',
    hint: '30-day',
  },
]

export const transactions: Transaction[] = [
  {
    id: 't1',
    asset: 'NVDA',
    type: 'Buy',
    amount: 12,
    price: 128.4,
    date: '2026-04-08',
    status: 'Completed',
  },
  {
    id: 't2',
    asset: 'AAPL',
    type: 'Sell',
    amount: 25,
    price: 241.2,
    date: '2026-04-07',
    status: 'Completed',
  },
  {
    id: 't3',
    asset: 'BTC',
    type: 'Buy',
    amount: 0.42,
    price: 97240,
    date: '2026-04-06',
    status: 'Completed',
  },
  {
    id: 't4',
    asset: 'MSFT',
    type: 'Buy',
    amount: 8,
    price: 438.9,
    date: '2026-04-05',
    status: 'Pending',
  },
  {
    id: 't5',
    asset: 'ETH',
    type: 'Sell',
    amount: 3.5,
    price: 3420,
    date: '2026-04-04',
    status: 'Completed',
  },
  {
    id: 't6',
    asset: 'TSLA',
    type: 'Sell',
    amount: 15,
    price: 352.1,
    date: '2026-04-03',
    status: 'Completed',
  },
  {
    id: 't7',
    asset: 'GOOGL',
    type: 'Buy',
    amount: 10,
    price: 178.45,
    date: '2026-04-02',
    status: 'Completed',
  },
  {
    id: 't8',
    asset: 'AMZN',
    type: 'Buy',
    amount: 14,
    price: 212.3,
    date: '2026-04-01',
    status: 'Failed',
  },
  {
    id: 't9',
    asset: 'META',
    type: 'Sell',
    amount: 6,
    price: 612.8,
    date: '2026-03-29',
    status: 'Completed',
  },
  {
    id: 't10',
    asset: 'AMD',
    type: 'Buy',
    amount: 40,
    price: 124.6,
    date: '2026-03-28',
    status: 'Completed',
  },
]

function makeSparkline(seed: number, points = 14): number[] {
  const out: number[] = []
  let v = 0.5 + (seed % 7) * 0.02
  for (let i = 0; i < points; i++) {
    v += Math.sin(i * 0.45 + seed) * 0.06 + (seed % 3) * 0.01
    v = Math.max(0.08, Math.min(0.92, v))
    out.push(v)
  }
  return out
}

export const topMovers: TopMover[] = [
  {
    ticker: 'NVDA',
    companyName: 'NVIDIA Corp.',
    price: 128.42,
    changePercent: 3.82,
    sparkline: makeSparkline(11),
  },
  {
    ticker: 'TSLA',
    companyName: 'Tesla Inc.',
    price: 352.1,
    changePercent: -2.14,
    sparkline: makeSparkline(23),
  },
  {
    ticker: 'BTC',
    companyName: 'Bitcoin',
    price: 97240,
    changePercent: 1.95,
    sparkline: makeSparkline(31),
  },
  {
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    price: 241.18,
    changePercent: 0.64,
    sparkline: makeSparkline(41),
  },
  {
    ticker: 'ETH',
    companyName: 'Ethereum',
    price: 3420,
    changePercent: -1.22,
    sparkline: makeSparkline(53),
  },
]
