import mongoose from 'mongoose'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { createApp } from '../app'
import { User } from '../models/User'

process.env.JWT_SECRET = 'jest-auth-secret'
process.env.MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex-finance-test'

const app = createApp()

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  it('POST /api/auth/register → 201 with token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'new@example.com',
      password: 'secret12',
      name: 'Test User',
    })
    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(typeof res.body.token).toBe('string')
    expect(res.body.user.email).toBe('new@example.com')
    expect(res.body.user.name).toBe('Test User')
    expect(res.body.user.plan).toBe('free')
  })

  it('POST /api/auth/login → 200 with token', async () => {
    const passwordHash = await bcrypt.hash('mypassword', 8)
    await User.create({
      email: 'login@example.com',
      passwordHash,
      name: 'Login User',
      plan: 'pro',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'mypassword',
    })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe('login@example.com')
  })

  it('POST /api/auth/login with wrong password → 401', async () => {
    const passwordHash = await bcrypt.hash('right', 8)
    await User.create({
      email: 'bad@example.com',
      passwordHash,
      name: 'X',
      plan: 'free',
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'bad@example.com',
      password: 'wrongpassword',
    })
    expect(res.status).toBe(401)
    expect(res.body.error).toBeDefined()
  })

  it('GET /api/auth/me without token → 401', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('GET /api/auth/me with valid token → 200 with user data', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'me@example.com',
      password: 'password1',
      name: 'Me User',
    })
    const login = await request(app).post('/api/auth/login').send({
      email: 'me@example.com',
      password: 'password1',
    })
    const token = login.body.token as string

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe('me@example.com')
    expect(res.body.user.name).toBe('Me User')
    expect(res.body.user.plan).toBe('free')
  })
})
