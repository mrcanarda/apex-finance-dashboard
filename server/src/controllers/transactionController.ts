import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import { Transaction } from '../models/Transaction'
import { HttpError } from '../middleware/errorHandler'

export async function list(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10))
  const typeFilter = req.query.type as string | undefined
  const search = (req.query.search as string | undefined)?.trim()

  const filter: Record<string, unknown> = { userId }
  if (typeFilter === 'buy' || typeFilter === 'sell') {
    filter.type = typeFilter
  }
  if (search) {
    filter.asset = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  }

  const total = await Transaction.countDocuments(filter)
  const rows = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  res.json({
    data: rows.map((t) => ({
      id: t._id.toString(),
      asset: t.asset,
      type: t.type,
      amount: t.amount,
      price: t.price,
      date: t.date.toISOString().slice(0, 10),
      status: t.status,
    })),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  })
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId
  const raw = req.params.id
  const id = String(Array.isArray(raw) ? raw[0] : raw)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, 'Invalid transaction id')
  }
  const tx = await Transaction.findOne({
    _id: id,
    userId,
  }).lean()
  if (!tx) {
    throw new HttpError(404, 'Transaction not found')
  }
  res.json({
    id: tx._id.toString(),
    asset: tx.asset,
    type: tx.type,
    amount: tx.amount,
    price: tx.price,
    date: tx.date.toISOString().slice(0, 10),
    status: tx.status,
  })
}

export async function create(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId
  const { asset, type, amount, price, date, status } = req.body as {
    asset: string
    type: 'buy' | 'sell'
    amount: number
    price: number
    date?: string
    status?: 'completed' | 'pending' | 'failed'
  }

  const doc = await Transaction.create({
    userId,
    asset: asset.toUpperCase(),
    type,
    amount,
    price,
    date: date ? new Date(date) : new Date(),
    status: status || 'completed',
  })

  res.status(201).json({
    id: doc._id.toString(),
    asset: doc.asset,
    type: doc.type,
    amount: doc.amount,
    price: doc.price,
    date: doc.date.toISOString().slice(0, 10),
    status: doc.status,
  })
}
