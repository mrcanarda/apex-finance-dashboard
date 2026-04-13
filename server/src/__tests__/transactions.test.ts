import mongoose from 'mongoose'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { createApp } from '../app'
import { User } from '../models/User'
import { Transaction } from '../models/Transaction'

process.env.JWT_SECRET = 'jest-tx-secret'
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-finance-test'

const app = createApp()

async function authHeader(): Promise<string> {
  const passwordHash = await bcrypt.hash('pw12345', 8)
  const user = await User.create({
    email: 'txuser@example.com',
    passwordHash,
    name: 'Tx User',
    plan: 'pro',
  })

  for (let i = 0; i < 12; i++) {
    await Transaction.create({
      userId: user._id,
      asset: i % 2 === 0 ? 'AAPL' : 'BTC',
      type: i % 3 === 0 ? 'sell' : 'buy',
      amount: 10,
      price: 100 + i,
      date: new Date(2026, 0, i + 1),
      status: 'completed',
    })
  }

  const login = await request(app).post('/api/auth/login').send({
    email: 'txuser@example.com',
    password: 'pw12345',
  })
  return `Bearer ${login.body.token as string}`
}

describe('Transactions API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await Promise.all([Transaction.deleteMany({}), User.deleteMany({})])
  })

  it('GET /api/transactions without auth → 401', async () => {
    const res = await request(app).get('/api/transactions')
    expect(res.status).toBe(401)
  })

  it('GET /api/transactions with auth → 200 with paginated data', async () => {
    const auth = await authHeader()
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', auth)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
    expect(res.body.total).toBe(12)
    expect(res.body.page).toBe(1)
    expect(res.body.limit).toBe(10)
  })

  it('GET /api/transactions?type=buy → only buy transactions', async () => {
    const auth = await authHeader()
    const res = await request(app)
      .get('/api/transactions?type=buy')
      .set('Authorization', auth)

    expect(res.status).toBe(200)
    expect(res.body.data.every((t: { type: string }) => t.type === 'buy')).toBe(
      true,
    )
  })

  it('GET /api/transactions?page=2&limit=5 → correct pagination', async () => {
    const auth = await authHeader()
    const res = await request(app)
      .get('/api/transactions?page=2&limit=5')
      .set('Authorization', auth)

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(2)
    expect(res.body.limit).toBe(5)
    expect(res.body.data.length).toBe(5)
    expect(res.body.totalPages).toBe(3)
  })

  it('POST /api/transactions with valid data → 201', async () => {
    const auth = await authHeader()
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', auth)
      .send({
        asset: 'NVDA',
        type: 'buy',
        amount: 5,
        price: 120.5,
        status: 'pending',
      })

    expect(res.status).toBe(201)
    expect(res.body.asset).toBe('NVDA')
    expect(res.body.type).toBe('buy')
    expect(res.body.status).toBe('pending')
  })

  it('POST /api/transactions with missing fields → 400', async () => {
    const auth = await authHeader()
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', auth)
      .send({ asset: 'X' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation failed')
  })
})
