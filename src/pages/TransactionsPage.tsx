import { useCallback, useEffect, useMemo, useState } from 'react'
import { dtoToRow, type TransactionRow } from '../api/mapTransaction'
import { isApiNetworkError } from '../api/client'
import * as txApi from '../api/transactions'
import { getToken } from '../api/token'
import type { TransactionStatus, TransactionType } from '../data/mockData'
import { transactionsFull as mockFull } from '../data/routeMockData'

const PAGE_SIZE = 10

function TypeBadge({ type }: { type: TransactionType }) {
  const isBuy = type === 'Buy'
  return (
    <span
      className={[
        'inline-flex rounded-md px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide',
        isBuy ? 'bg-positive-soft text-positive' : 'bg-negative-soft text-negative',
      ].join(' ')}
    >
      {type}
    </span>
  )
}

function StatusPill({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, string> = {
    Completed: 'text-positive',
    Pending: 'text-accent',
    Failed: 'text-negative',
  }
  return (
    <span className={`font-mono text-xs ${map[status]}`}>{status}</span>
  )
}

function mockFilter(
  rows: typeof mockFull,
  typeFilter: 'all' | 'buy' | 'sell',
  search: string,
) {
  const q = search.trim().toLowerCase()
  return rows.filter((t) => {
    if (typeFilter === 'buy' && t.type !== 'Buy') return false
    if (typeFilter === 'sell' && t.type !== 'Sell') return false
    if (q && !t.asset.toLowerCase().includes(q) && !t.reference.toLowerCase().includes(q))
      return false
    return true
  })
}

/** Full history with pagination; date filters are UI-only */
export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [useMock, setUseMock] = useState(!getToken())

  const [rows, setRows] = useState<TransactionRow[]>(
    mockFilter(mockFull, 'all', '').slice(0, PAGE_SIZE).map((t) => ({
      id: t.id,
      asset: t.asset,
      type: t.type,
      amount: t.amount,
      price: t.price,
      total: t.total,
      fee: t.fee,
      date: t.date,
      status: t.status,
      reference: t.reference,
    })),
  )
  const [total, setTotal] = useState(mockFull.length)
  const [totalPages, setTotalPages] = useState(
    Math.ceil(mockFull.length / PAGE_SIZE),
  )

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)

    if (!getToken()) {
      setUseMock(true)
      const filtered = mockFilter(mockFull, typeFilter, search)
      const start = (page - 1) * PAGE_SIZE
      setRows(
        filtered.slice(start, start + PAGE_SIZE).map((t) => ({
          id: t.id,
          asset: t.asset,
          type: t.type,
          amount: t.amount,
          price: t.price,
          total: t.total,
          fee: t.fee,
          date: t.date,
          status: t.status,
          reference: t.reference,
        })),
      )
      setTotal(filtered.length)
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
      setLoading(false)
      return
    }

    try {
      setUseMock(false)
      const res = await txApi.listTransactions({
        page,
        limit: PAGE_SIZE,
        type: typeFilter === 'all' ? undefined : typeFilter,
        search: search.trim() || undefined,
      })
      setRows(res.data.map(dtoToRow))
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch (e) {
      if (isApiNetworkError(e)) {
        setErr('API unreachable — local mock ledger below.')
      } else {
        setErr(e instanceof Error ? e.message : 'Failed to load')
      }
      setUseMock(true)
      const filtered = mockFilter(mockFull, typeFilter, search)
      const start = (page - 1) * PAGE_SIZE
      setRows(
        filtered.slice(start, start + PAGE_SIZE).map((t) => ({
          id: t.id,
          asset: t.asset,
          type: t.type,
          amount: t.amount,
          price: t.price,
          total: t.total,
          fee: t.fee,
          date: t.date,
          status: t.status,
          reference: t.reference,
        })),
      )
      setTotal(filtered.length)
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter, search])

  useEffect(() => {
    void load()
  }, [load])

  const showingFrom = useMemo(() => {
    if (total === 0) return 0
    return (page - 1) * PAGE_SIZE + 1
  }, [page, total])

  const showingTo = useMemo(
    () => Math.min(page * PAGE_SIZE, total),
    [page, total],
  )

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

  void dateFrom
  void dateTo

  return (
    <div className="space-y-6">
      {err ? (
        <p className="font-mono text-sm text-accent">{err}</p>
      ) : null}
      {loading ? (
        <p className="font-mono text-sm text-muted">Loading transactions…</p>
      ) : null}
      {useMock && !loading ? (
        <p className="font-mono text-xs text-muted">
          {getToken()
            ? 'Showing mock transactions (offline fallback).'
            : 'Mock ledger — sign in for API-backed history.'}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex max-w-xl flex-1 flex-col gap-2">
          <label
            htmlFor="tx-search"
            className="font-mono text-[10px] uppercase tracking-wider text-muted"
          >
            Search
          </label>
          <input
            id="tx-search"
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Ticker, reference…"
            className="rounded-lg border border-edge bg-input px-3 py-2 font-mono text-sm text-fg outline-none placeholder:text-[color:var(--placeholder)] focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'All'],
              ['buy', 'Buy'],
              ['sell', 'Sell'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTypeFilter(id)
                setPage(1)
              }}
              className={[
                'rounded-lg border px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors',
                typeFilter === id
                  ? 'border-accent bg-card text-accent'
                  : 'border-edge text-muted hover:text-fg',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="date-from"
              className="block font-mono text-[10px] uppercase tracking-wider text-muted"
            >
              From
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1 rounded-lg border border-edge bg-input px-3 py-2 font-mono text-xs text-fg outline-none focus:border-accent/50"
            />
          </div>
          <div>
            <label
              htmlFor="date-to"
              className="block font-mono text-[10px] uppercase tracking-wider text-muted"
            >
              To
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1 rounded-lg border border-edge bg-input px-3 py-2 font-mono text-xs text-fg outline-none focus:border-accent/50"
            />
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg border border-accent/40 bg-card px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-accent transition-colors hover:bg-accent/10"
        >
          Export CSV
        </button>
      </div>

      <p className="font-mono text-[11px] text-muted">
        Date filters are UI-only. Search & type filter apply to API when signed in.
      </p>

      <div className="rounded-[12px] border border-edge bg-card shadow-card-inset">
        <div className="border-b border-edge px-6 py-5">
          <h2
            className="text-xl font-normal tracking-tight text-fg"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Transaction history
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">
            Showing {showingFrom}–{showingTo} of {total}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-medium">Asset</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Fee</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={[
                    'border-t border-edge font-mono text-sm text-fg transition-colors',
                    i % 2 === 0 ? 'bg-row' : 'bg-transparent',
                    'hover:bg-row-hover',
                  ].join(' ')}
                >
                  <td className="px-6 py-3 font-medium">{row.asset}</td>
                  <td className="px-6 py-3">
                    <TypeBadge type={row.type} />
                  </td>
                  <td className="px-6 py-3 tabular-nums text-muted">
                    {row.amount}
                  </td>
                  <td className="px-6 py-3 tabular-nums text-muted">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                    }).format(row.price)}
                  </td>
                  <td className="px-6 py-3 tabular-nums text-accent">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                    }).format(row.total)}
                  </td>
                  <td className="px-6 py-3 tabular-nums text-muted">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                    }).format(row.fee)}
                  </td>
                  <td className="px-6 py-3 tabular-nums text-muted">
                    {row.date}
                  </td>
                  <td className="px-6 py-3">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-6 py-3 font-mono text-[11px] text-muted">
                    {row.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge px-6 py-4">
          <p className="font-mono text-xs text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={page <= 1}
              className="rounded-lg border border-edge px-4 py-2 font-mono text-xs text-fg transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={page >= totalPages}
              className="rounded-lg border border-edge px-4 py-2 font-mono text-xs text-fg transition-colors hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
