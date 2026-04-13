import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './routes/auth'
import marketRoutes from './routes/markets'
import portfolioRoutes from './routes/portfolio'
import transactionRoutes from './routes/transactions'

export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/portfolio', portfolioRoutes)
  app.use('/api/transactions', transactionRoutes)
  app.use('/api/markets', marketRoutes)

  app.use(errorHandler)
  return app
}
