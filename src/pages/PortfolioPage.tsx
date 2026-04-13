import { useCallback, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { isApiNetworkError } from '../api/client'
import * as portfolioApi from '../api/portfolio'
import { getToken } from '../api/token'
import {
  holdingPerformance as mockPerf,
  holdings as mockHoldings,
  portfolioSummary as mockSummary,
} from '../data/routeMockData'

const money = (n: number, fraction = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(n)

function BarTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { value: number; payload: { asset: string } }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0]
  return (
    <div className="rounded-lg border border-edge bg-card px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {row.payload.asset}
      </p>
      <p
        className={`font-mono text-sm ${row.value >= 0 ? 'text-positive' : 'text-negative'}`}
      >
        {money(row.value)}
      </p>
    </div>
  )
}

/** Holdings, summary metrics, and P&L by asset */
export function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [summary, setSummary] = useState(mockSummary)
  const [holdings, setHoldings] = useState(mockHoldings)
  const [perf, setPerf] = useState(mockPerf)

  const load = useCallback(async () => {
    setLoading(true)
    setErr(null)
    if (!getToken()) {
      setSummary(mockSummary)
      setHoldings(mockHoldings)
      setPerf(mockPerf)
      setLoading(false)
      return
    }
    try {
      const [s, rows] = await Promise.all([
        portfolioApi.getSummary(),
        portfolioApi.getHoldings(),
      ])
      setSummary({
        totalInvested: s.totalInvested,
        currentValue: s.currentValue,
        totalReturnPercent: s.totalReturnPercent,
      })
      const mapped = rows.map((h) => ({
        asset: h.asset,
        shares: h.shares,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice: h.currentPrice,
        totalValue: h.totalValue,
        pnl: h.pnl,
        pnlPercent: h.pnlPercent,
        category: ['BTC', 'ETH', 'SOL'].includes(h.asset)
          ? ('crypto' as const)
          : ('stock' as const),
      }))
      setHoldings(mapped)
      setPerf(
        mapped.map((h) => ({
          asset: h.asset,
          pnl: Math.round(h.pnl * 100) / 100,
        })),
      )
    } catch (e) {
      if (isApiNetworkError(e)) {
        setErr('API unreachable — showing mock portfolio.')
      } else {
        setErr(e instanceof Error ? e.message : 'Failed to load')
      }
      setSummary(mockSummary)
      setHoldings(mockHoldings)
      setPerf(mockPerf)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const positiveReturn = summary.totalReturnPercent >= 0

  return (
    <div className="space-y-8">
      {err ? (
        <p className="font-mono text-sm text-accent">{err}</p>
      ) : null}
      {loading ? (
        <p className="font-mono text-sm text-muted">Loading portfolio…</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-[12px] border border-edge bg-card p-6 shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.12),0_0_28px_-4px_rgba(240,165,0,0.35)]">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Total invested
          </p>
          <p
            className="mt-2 text-3xl text-fg sm:text-4xl"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {money(summary.totalInvested, 0)}
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Cost basis across positions
          </p>
        </article>
        <article className="rounded-[12px] border border-edge bg-card p-6 shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.12),0_0_28px_-4px_rgba(240,165,0,0.35)]">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Current value
          </p>
          <p
            className="mt-2 text-3xl text-accent sm:text-4xl"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {money(summary.currentValue, 0)}
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Mark-to-market
          </p>
        </article>
        <article className="rounded-[12px] border border-edge bg-card p-6 shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.12),0_0_28px_-4px_rgba(240,165,0,0.35)]">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Total return
          </p>
          <p
            className={`mt-2 text-3xl sm:text-4xl ${positiveReturn ? 'text-positive' : 'text-negative'}`}
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {positiveReturn ? '+' : ''}
            {summary.totalReturnPercent.toFixed(2)}%
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Since inception (mock)
          </p>
        </article>
      </div>

      <div className="rounded-[12px] border border-edge bg-card p-6 shadow-card-inset">
        <div className="mb-6">
          <h2
            className="text-xl font-normal tracking-tight text-fg"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Performance by asset
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">
            Unrealized P&L ($) — green positive, red negative
          </p>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={perf}
              margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="asset"
                tick={{
                  fill: 'var(--text-secondary)',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1000 || v <= -1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                }
                tick={{
                  fill: 'var(--text-secondary)',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                }}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip
                content={<BarTooltip />}
                cursor={{
                  fill: 'color-mix(in srgb, var(--text-primary) 6%, transparent)',
                }}
                animationDuration={200}
              />
              <Bar
                dataKey="pnl"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationDuration={900}
              >
                {perf.map((entry) => (
                  <Cell
                    key={entry.asset}
                    fill={
                      entry.pnl >= 0 ? 'var(--positive)' : 'var(--negative)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[12px] border border-edge bg-card shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.1),0_0_24px_-6px_rgba(240,165,0,0.25)]">
        <div className="border-b border-edge px-6 py-5">
          <h2
            className="text-xl font-normal tracking-tight text-fg"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Holdings
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">
            10 positions — equities and digital assets
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-medium">Asset</th>
                <th className="px-6 py-3 font-medium">Shares</th>
                <th className="px-6 py-3 font-medium">Avg buy</th>
                <th className="px-6 py-3 font-medium">Current</th>
                <th className="px-6 py-3 font-medium">Total value</th>
                <th className="px-6 py-3 font-medium">P&L</th>
                <th className="px-6 py-3 font-medium">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const pnlPos = h.pnl >= 0
                return (
                  <tr
                    key={h.asset}
                    className={[
                      'border-t border-edge font-mono text-sm text-fg transition-colors',
                      i % 2 === 0 ? 'bg-row' : 'bg-transparent',
                      'hover:bg-row-hover',
                    ].join(' ')}
                  >
                    <td className="px-6 py-3 font-medium tracking-tight">
                      {h.asset}
                      <span className="ml-2 text-[10px] uppercase text-muted">
                        {h.category === 'crypto' ? 'Crypto' : 'Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-3 tabular-nums text-muted">
                      {h.shares}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-muted">
                      {money(h.avgBuyPrice)}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-fg">
                      {money(h.currentPrice)}
                    </td>
                    <td className="px-6 py-3 tabular-nums text-accent">
                      {money(h.totalValue)}
                    </td>
                    <td
                      className={`px-6 py-3 tabular-nums ${pnlPos ? 'text-positive' : 'text-negative'}`}
                    >
                      {pnlPos ? '+' : ''}
                      {money(h.pnl)}
                    </td>
                    <td
                      className={`px-6 py-3 tabular-nums ${pnlPos ? 'text-positive' : 'text-negative'}`}
                    >
                      {pnlPos ? '+' : ''}
                      {h.pnlPercent.toFixed(2)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
