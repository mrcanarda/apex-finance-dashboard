import { useCallback, useEffect, useMemo, useState } from 'react'
import { MiniSparkline } from '../components/MiniSparkline'
import { isApiNetworkError } from '../api/client'
import * as marketsApi from '../api/markets'
import {
  type MarketAsset,
  type MarketCategory,
  marketAssets as mockAssets,
} from '../data/routeMockData'

type FilterTab = 'all' | MarketCategory
type SortField = 'price' | 'change' | 'mcap'

function formatCap(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  return `$${(n / 1e6).toFixed(0)}M`
}

function formatPrice(p: number): string {
  return p >= 1000
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(p)
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(p)
}

/** Market overview with filters, sort, and sparkline cards */
export function MarketsPage() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [raw, setRaw] = useState<MarketAsset[]>(mockAssets)
  const [usingMock, setUsingMock] = useState(true)

  const [filter, setFilter] = useState<FilterTab>('all')
  const [sortField, setSortField] = useState<SortField>('mcap')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)
    try {
      const list = await marketsApi.listMarkets()
      setRaw(
        list.map((a) => ({
          ticker: a.symbol,
          name: a.name,
          price: a.price,
          change24hPercent: a.changePercent24h,
          marketCap: a.marketCap,
          category: a.type,
          sparkline: Array.from({ length: 16 }, (_, i) => 0.4 + (i % 5) * 0.03),
        })),
      )
      setUsingMock(false)
    } catch (e) {
      if (isApiNetworkError(e)) {
        setErr('API unreachable — showing mock markets.')
      } else {
        setErr(e instanceof Error ? e.message : 'Failed to load')
      }
      setRaw(mockAssets)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const visible = useMemo(() => {
    let list: MarketAsset[] =
      filter === 'all'
        ? raw
        : raw.filter((a) => a.category === filter)
    list = [...list].sort((a, b) => {
      const av =
        sortField === 'price'
          ? a.price
          : sortField === 'change'
            ? a.change24hPercent
            : a.marketCap
      const bv =
        sortField === 'price'
          ? b.price
          : sortField === 'change'
            ? b.change24hPercent
            : b.marketCap
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return list
  }, [filter, sortField, sortDir, raw])

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'stock', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
  ]

  const sortOptions: { id: SortField; label: string }[] = [
    { id: 'price', label: 'Price' },
    { id: 'change', label: 'Change %' },
    { id: 'mcap', label: 'Market cap' },
  ]

  return (
    <div className="space-y-6">
      {err ? (
        <p className="font-mono text-sm text-accent">{err}</p>
      ) : null}
      {loading ? (
        <p className="font-mono text-sm text-muted">Loading markets…</p>
      ) : null}
      {usingMock && !loading ? (
        <p className="font-mono text-xs text-muted">Mock market data</p>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={[
                'rounded-lg border px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors',
                filter === t.id
                  ? 'border-accent bg-card text-accent'
                  : 'border-edge text-muted hover:border-edge hover:text-fg',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Sort by
          </span>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (sortField === s.id) {
                    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
                  } else {
                    setSortField(s.id)
                    setSortDir(s.id === 'change' ? 'desc' : 'desc')
                  }
                }}
                className={[
                  'rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors',
                  sortField === s.id
                    ? 'border-edge bg-row text-accent'
                    : 'border-edge text-muted hover:text-fg',
                ].join(' ')}
              >
                {s.label}
                {sortField === s.id ? (
                  <span className="ml-1 text-muted">
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((a) => {
          const up = a.change24hPercent >= 0
          return (
            <article
              key={a.ticker}
              className="group rounded-[12px] border border-edge bg-card p-5 shadow-card-inset transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.12),0_0_28px_-4px_rgba(240,165,0,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-fg">
                    {a.ticker}
                  </p>
                  <p className="mt-0.5 line-clamp-2 font-mono text-[11px] text-muted">
                    {a.name}
                  </p>
                </div>
                <span className="shrink-0 rounded border border-edge px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
                  {a.category === 'crypto' ? 'Crypto' : 'Stock'}
                </span>
              </div>
              <p
                className="mt-4 text-2xl text-accent"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {formatPrice(a.price)}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1 font-mono text-sm tabular-nums ${up ? 'text-positive' : 'text-negative'}`}
                >
                  {up ? '▲' : '▼'} {up ? '+' : ''}
                  {a.change24hPercent.toFixed(2)}%
                </span>
                <MiniSparkline data={a.sparkline} directional />
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted">
                Mkt cap · {formatCap(a.marketCap)}
              </p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
