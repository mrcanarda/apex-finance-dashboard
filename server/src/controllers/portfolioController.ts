import type { Request, Response } from 'express'
import { Holding } from '../models/Holding'
import { PortfolioHistory } from '../models/PortfolioHistory'

export async function summary(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId
  const holdings = await Holding.find({ userId })

  const totalInvested = holdings.reduce(
    (s, h) => s + h.shares * h.avgBuyPrice,
    0,
  )
  const currentValue = holdings.reduce((s, h) => s + h.totalValue, 0)
  const totalReturnPercent =
    totalInvested > 0
      ? ((currentValue - totalInvested) / totalInvested) * 100
      : 0

  res.json({
    totalInvested: Math.round(totalInvested * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalReturnPercent: Math.round(totalReturnPercent * 100) / 100,
  })
}

export async function holdingsList(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId
  const rows = await Holding.find({ userId }).sort({ asset: 1 }).lean()
  res.json({
    holdings: rows.map((h) => ({
      id: h._id.toString(),
      asset: h.asset,
      shares: h.shares,
      avgBuyPrice: h.avgBuyPrice,
      currentPrice: h.currentPrice,
      totalValue: h.totalValue,
      pnl: h.pnl,
      pnlPercent: h.pnlPercent,
    })),
  })
}

export async function history(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId
  const points = await PortfolioHistory.find({ userId })
    .sort({ order: 1 })
    .lean()

  res.json({
    points: points.map((p) => ({
      month: p.month,
      value: p.value,
    })),
  })
}
