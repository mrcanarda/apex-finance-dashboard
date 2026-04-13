import type { Request, Response } from 'express'
import { MarketAsset } from '../models/MarketAsset'
import { HttpError } from '../middleware/errorHandler'

export async function list(req: Request, res: Response): Promise<void> {
  const typeFilter = req.query.type as string | undefined
  const filter: Record<string, unknown> = {}
  if (typeFilter === 'stock' || typeFilter === 'crypto') {
    filter.type = typeFilter
  }
  const assets = await MarketAsset.find(filter).sort({ symbol: 1 }).lean()
  res.json({
    assets: assets.map((a) => ({
      id: a._id.toString(),
      symbol: a.symbol,
      name: a.name,
      type: a.type,
      price: a.price,
      change24h: a.change24h,
      changePercent24h: a.changePercent24h,
      marketCap: a.marketCap,
      volume: a.volume,
    })),
  })
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const raw = req.params.symbol
  const symbol = String(Array.isArray(raw) ? raw[0] : raw).toUpperCase()
  const a = await MarketAsset.findOne({ symbol }).lean()
  if (!a) {
    throw new HttpError(404, 'Market asset not found')
  }
  res.json({
    id: a._id.toString(),
    symbol: a.symbol,
    name: a.name,
    type: a.type,
    price: a.price,
    change24h: a.change24h,
    changePercent24h: a.changePercent24h,
    marketCap: a.marketCap,
    volume: a.volume,
  })
}
