/**
 * Seed script — run: npm run seed (from /server)
 */
import dotenv from 'dotenv'
import path from 'path'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { env } from '../config/env'
import { User } from '../models/User'
import { Transaction } from '../models/Transaction'
import { Holding } from '../models/Holding'
import { MarketAsset } from '../models/MarketAsset'
import { PortfolioHistory } from '../models/PortfolioHistory'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const HISTORY_VALUES = [
  218_400, 224_100, 219_800, 231_200, 228_900, 241_500, 246_200, 239_100,
  252_800, 261_400, 276_300, 284_520,
]

const HOLDINGS_SEED = [
  { asset: 'NVDA', shares: 48, avgBuyPrice: 92.4, currentPrice: 128.42 },
  { asset: 'AAPL', shares: 120, avgBuyPrice: 198.1, currentPrice: 241.18 },
  { asset: 'BTC', shares: 1.85, avgBuyPrice: 62400, currentPrice: 97240 },
  { asset: 'MSFT', shares: 22, avgBuyPrice: 380, currentPrice: 438.9 },
  { asset: 'ETH', shares: 14.2, avgBuyPrice: 2650, currentPrice: 3420 },
  { asset: 'TSLA', shares: 35, avgBuyPrice: 410.2, currentPrice: 352.1 },
  { asset: 'AMD', shares: 200, avgBuyPrice: 108.4, currentPrice: 124.6 },
  { asset: 'GOOGL', shares: 55, avgBuyPrice: 142, currentPrice: 178.45 },
  { asset: 'SOL', shares: 420, avgBuyPrice: 118, currentPrice: 142.3 },
  { asset: 'META', shares: 18, avgBuyPrice: 520, currentPrice: 612.8 },
]

const MARKET_SEED = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' as const, price: 241.18, change24h: 1.2, changePercent24h: 0.64, marketCap: 3_650_000_000_000, volume: 52_000_000 },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock' as const, price: 438.9, change24h: 4.2, changePercent24h: 1.12, marketCap: 3_280_000_000_000, volume: 22_000_000 },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock' as const, price: 128.42, change24h: 4.5, changePercent24h: 3.82, marketCap: 3_150_000_000_000, volume: 45_000_000 },
  { symbol: 'GOOGL', name: 'Alphabet', type: 'stock' as const, price: 178.45, change24h: -0.5, changePercent24h: -0.31, marketCap: 2_210_000_000_000, volume: 28_000_000 },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock' as const, price: 212.3, change24h: 1.8, changePercent24h: 0.88, marketCap: 2_180_000_000_000, volume: 35_000_000 },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock' as const, price: 352.1, change24h: -7.5, changePercent24h: -2.14, marketCap: 1_120_000_000_000, volume: 98_000_000 },
  { symbol: 'META', name: 'Meta', type: 'stock' as const, price: 612.8, change24h: 6.2, changePercent24h: 1.05, marketCap: 1_540_000_000_000, volume: 15_000_000 },
  { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' as const, price: 97240, change24h: 1800, changePercent24h: 1.95, marketCap: 1_920_000_000_000, volume: 42_000_000_000 },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto' as const, price: 3420, change24h: -42, changePercent24h: -1.22, marketCap: 410_000_000_000, volume: 18_000_000_000 },
  { symbol: 'SOL', name: 'Solana', type: 'crypto' as const, price: 142.3, change24h: 5.6, changePercent24h: 4.1, marketCap: 68_000_000_000, volume: 3_200_000_000 },
  { symbol: 'AMD', name: 'AMD', type: 'stock' as const, price: 124.6, change24h: -0.6, changePercent24h: -0.45, marketCap: 200_000_000_000, volume: 45_000_000 },
  { symbol: 'COIN', name: 'Coinbase', type: 'stock' as const, price: 318.4, change24h: 7.2, changePercent24h: 2.33, marketCap: 78_000_000_000, volume: 8_000_000 },
]

async function seed() {
  await mongoose.connect(env.mongoUri)

  const existing = await User.findOne({ email: 'demo@apex.com' })
  if (existing) {
    await Transaction.deleteMany({ userId: existing._id })
    await Holding.deleteMany({ userId: existing._id })
    await PortfolioHistory.deleteMany({ userId: existing._id })
    await User.deleteOne({ _id: existing._id })
  }

  const passwordHash = await bcrypt.hash('demo1234', 10)
  const user = await User.create({
    email: 'demo@apex.com',
    passwordHash,
    name: 'Jordan Drake',
    plan: 'pro',
  })
  const userId = user._id

  for (let i = 0; i < HOLDINGS_SEED.length; i++) {
    const h = HOLDINGS_SEED[i]
    const totalValue = Math.round(h.shares * h.currentPrice * 100) / 100
    const cost = h.shares * h.avgBuyPrice
    const pnl = Math.round((totalValue - cost) * 100) / 100
    const pnlPercent = Math.round(((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 10000) / 100
    await Holding.create({
      userId,
      asset: h.asset,
      shares: h.shares,
      avgBuyPrice: h.avgBuyPrice,
      currentPrice: h.currentPrice,
      totalValue,
      pnl,
      pnlPercent,
    })
  }

  const TX_ASSETS = [
    'AAPL', 'MSFT', 'NVDA', 'TSLA', 'BTC', 'ETH', 'GOOGL', 'META', 'AMD', 'SOL', 'AMZN', 'COIN',
  ]
  const statuses = ['completed', 'completed', 'completed', 'pending', 'failed'] as const

  for (let i = 0; i < 30; i++) {
    const asset = TX_ASSETS[i % TX_ASSETS.length]
    const type = i % 3 === 0 ? 'sell' : 'buy'
    const amount = type === 'buy' ? 4 + (i % 8) : 2 + (i % 5)
    const price =
      asset === 'BTC' ? 92000 + i * 400 : asset === 'ETH' ? 3200 + i * 12 : 80 + i * 3.5
    const date = new Date(2026, i % 4, 28 - (i % 27))
    await Transaction.create({
      userId,
      asset,
      type,
      amount,
      price: Math.round(price * 100) / 100,
      date,
      status: statuses[i % statuses.length],
    })
  }

  for (let i = 0; i < 12; i++) {
    await PortfolioHistory.create({
      userId,
      month: MONTHS[i],
      value: HISTORY_VALUES[i],
      order: i,
    })
  }

  await MarketAsset.deleteMany({})
  for (const m of MARKET_SEED) {
    await MarketAsset.create(m)
  }

  console.log('Seed complete. demo@apex.com / demo1234')
  await mongoose.disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
