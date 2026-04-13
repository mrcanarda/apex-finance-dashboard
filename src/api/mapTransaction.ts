import type { Transaction } from '../data/mockData'
import type { TransactionDto } from './transactions'

function titleCaseType(t: 'buy' | 'sell'): Transaction['type'] {
  return t === 'buy' ? 'Buy' : 'Sell'
}

function titleCaseStatus(
  s: 'completed' | 'pending' | 'failed',
): Transaction['status'] {
  if (s === 'completed') return 'Completed'
  if (s === 'pending') return 'Pending'
  return 'Failed'
}

export function mapTransactionDto(row: TransactionDto): Transaction {
  return {
    id: row.id,
    asset: row.asset,
    type: titleCaseType(row.type),
    amount: row.amount,
    price: row.price,
    date: row.date,
    status: titleCaseStatus(row.status),
  }
}

export interface TransactionRow {
  id: string
  asset: string
  type: Transaction['type']
  amount: number
  price: number
  total: number
  fee: number
  date: string
  status: Transaction['status']
  reference: string
}

export function dtoToRow(d: TransactionDto): TransactionRow {
  const total = Math.round(d.amount * d.price * 100) / 100
  const fee = Math.round(total * 0.0008 * 100) / 100
  const tr = mapTransactionDto(d)
  return {
    ...tr,
    total,
    fee,
    reference: `APEX-${d.id.slice(-8)}`,
  }
}
