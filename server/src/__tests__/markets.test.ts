import mongoose from 'mongoose'
import request from 'supertest'
import { createApp } from '../app'
import { MarketAsset } from '../models/MarketAsset'

process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-finance-test'

const app = createApp()

describe('Markets API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await MarketAsset.deleteMany({})
    await MarketAsset.create([
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        price: 90000,
        change24h: 100,
        changePercent24h: 0.1,
        marketCap: 1e12,
        volume: 1e10,
      },
      {
        symbol: 'AAPL',
        name: 'Apple',
        type: 'stock',
        price: 200,
        change24h: 2,
        changePercent24h: 1,
        marketCap: 3e12,
        volume: 1e8,
      },
    ])
  })

  it('GET /api/markets → all assets', async () => {
    const res = await request(app).get('/api/markets')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.assets)).toBe(true)
    expect(res.body.assets.length).toBe(2)
  })

  it('GET /api/markets?type=crypto → only crypto', async () => {
    const res = await request(app).get('/api/markets?type=crypto')
    expect(res.status).toBe(200)
    expect(res.body.assets.length).toBe(1)
    expect(res.body.assets[0].symbol).toBe('BTC')
  })

  it('GET /api/markets/:symbol → single asset or 404', async () => {
    const ok = await request(app).get('/api/markets/BTC')
    expect(ok.status).toBe(200)
    expect(ok.body.symbol).toBe('BTC')
    expect(ok.body.name).toBe('Bitcoin')

    const missing = await request(app).get('/api/markets/UNKNOWN')
    expect(missing.status).toBe(404)
  })
})
