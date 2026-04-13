import mongoose from 'mongoose'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { createApp } from '../app'
import { User } from '../models/User'
import { Holding } from '../models/Holding'
import { PortfolioHistory } from '../models/PortfolioHistory'

process.env.JWT_SECRET = 'jest-portfolio-secret'
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-finance-test'

const app = createApp()

describe('Portfolio API', () => {
  let token: string

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Holding.deleteMany({}),
      PortfolioHistory.deleteMany({}),
    ])

    const passwordHash = await bcrypt.hash('portfolio1', 8)
    const user = await User.create({
      email: 'port@example.com',
      passwordHash,
      name: 'Portfolio User',
      plan: 'pro',
    })

    await Holding.create({
      userId: user._id,
      asset: 'AAPL',
      shares: 10,
      avgBuyPrice: 100,
      currentPrice: 150,
      totalValue: 1500,
      pnl: 500,
      pnlPercent: 50,
    })

    for (let i = 0; i < 12; i++) {
      await PortfolioHistory.create({
        userId: user._id,
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        value: 100_000 + i * 1000,
        order: i,
      })
    }

    const login = await request(app).post('/api/auth/login').send({
      email: 'port@example.com',
      password: 'portfolio1',
    })
    token = login.body.token as string
  })

  it('GET /api/portfolio/summary → correct shape', async () => {
    const res = await request(app)
      .get('/api/portfolio/summary')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('totalInvested')
    expect(res.body).toHaveProperty('currentValue')
    expect(res.body).toHaveProperty('totalReturnPercent')
    expect(typeof res.body.totalInvested).toBe('number')
    expect(typeof res.body.currentValue).toBe('number')
    expect(typeof res.body.totalReturnPercent).toBe('number')
    expect(res.body.totalInvested).toBe(1000)
    expect(res.body.currentValue).toBe(1500)
  })

  it('GET /api/portfolio/holdings → array of holdings', async () => {
    const res = await request(app)
      .get('/api/portfolio/holdings')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.holdings)).toBe(true)
    expect(res.body.holdings.length).toBe(1)
    expect(res.body.holdings[0].asset).toBe('AAPL')
    expect(res.body.holdings[0]).toHaveProperty('pnlPercent')
  })

  it('GET /api/portfolio/history → 12 data points', async () => {
    const res = await request(app)
      .get('/api/portfolio/history')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.points)).toBe(true)
    expect(res.body.points.length).toBe(12)
    expect(res.body.points[0]).toHaveProperty('month')
    expect(res.body.points[0]).toHaveProperty('value')
  })
})
