import { useCallback, useEffect, useState } from 'react'
import { AllocationChart } from '../components/AllocationChart'
import { KPICard } from '../components/KPICard'
import { PortfolioChart } from '../components/PortfolioChart'
import { TopMovers } from '../components/TopMovers'
import { TransactionsTable } from '../components/TransactionsTable'
import { isApiNetworkError } from '../api/client'
import { mapTransactionDto } from '../api/mapTransaction'
import * as marketsApi from '../api/markets'
import * as portfolioApi from '../api/portfolio'
import * as txApi from '../api/transactions'
import { getToken } from '../api/token'
import {
  allocation,
  kpiMetrics as mockKpi,
  portfolioHistory as mockHistory,
  topMovers as mockMovers,
  transactions as mockTx,
  type KPIConfig,
  type PortfolioPoint,
  type TopMover,
  type Transaction,
} from '../data/mockData'

function sparkFromSymbol(s: string): number[] {
  return Array.from({ length: 16 }, (_, i) => {
    const x = i * 0.45 + s.length * 0.2
    return 0.45 + Math.sin(x) * 0.22 + (s.charCodeAt(0) % 7) * 0.01
  })
}

/** Main dashboard — KPIs, charts, recent activity (API + mock fallback) */
export function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMock, setUsingMock] = useState(false)

  const [kpiMetrics, setKpiMetrics] = useState<KPIConfig[]>(mockKpi)
  const [history, setHistory] = useState<PortfolioPoint[]>(mockHistory)
  const [txRows, setTxRows] = useState<Transaction[]>(mockTx)
  const [movers, setMovers] = useState<TopMover[]>(mockMovers)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!getToken()) {
      setUsingMock(true)
      setKpiMetrics(mockKpi)
      setHistory(mockHistory)
      setTxRows(mockTx.slice(0, 10))
      setMovers(mockMovers)
      setLoading(false)
      return
    }

    try {
      const [summary, holdings, points, txPage, marketList] =
        await Promise.all([
          portfolioApi.getSummary(),
          portfolioApi.getHoldings(),
          portfolioApi.getHistory(),
          txApi.listTransactions({ page: 1, limit: 10 }),
          marketsApi.listMarkets().catch(() => []),
        ])

      setUsingMock(false)
      setHistory(
        points.map((p) => ({ month: p.month, value: p.value })),
      )

      const nextKpi: KPIConfig[] = [
        {
          id: 'balance',
          label: 'Total Balance',
          value: summary.currentValue,
          format: 'currency',
          hint: 'Across all accounts',
        },
        {
          id: 'pnl',
          label: 'Monthly P&L',
          value: mockKpi[1].value,
          format: 'currency',
          fractionDigits: 2,
          hint: mockKpi[1].hint,
        },
        {
          id: 'assets',
          label: 'Active Assets',
          value: holdings.length,
          format: 'number',
          hint: 'Positions tracked',
        },
        {
          id: 'change',
          label: 'Portfolio Change',
          value: summary.totalReturnPercent,
          format: 'percent',
          hint: '30-day',
        },
      ]
      setKpiMetrics(nextKpi)
      setTxRows(txPage.data.map(mapTransactionDto))

      const top = marketList.slice(0, 5).map(
        (a): TopMover => ({
          ticker: a.symbol,
          companyName: a.name,
          price: a.price,
          changePercent: a.changePercent24h,
          sparkline: sparkFromSymbol(a.symbol),
        }),
      )
      setMovers(top.length ? top : mockMovers)
    } catch (e) {
      if (isApiNetworkError(e)) {
        setError('API unreachable — showing cached mock data.')
      } else {
        setError(
          e instanceof Error ? e.message : 'Could not load dashboard data.',
        )
      }
      setUsingMock(true)
      setKpiMetrics(mockKpi)
      setHistory(mockHistory)
      setTxRows(mockTx.slice(0, 10))
      setMovers(mockMovers)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <>
      {error ? (
        <p className="mb-4 font-mono text-sm text-accent">{error}</p>
      ) : null}
      {loading ? (
        <p className="mb-6 font-mono text-sm text-muted">Loading dashboard…</p>
      ) : null}
      {usingMock && !loading ? (
        <p className="mb-4 font-mono text-xs text-muted">
          Using embedded mock data
          {getToken() ? '' : ' — sign in and run the API + seed for live data.'}
        </p>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiMetrics.map((kpi, i) => (
          <KPICard key={kpi.id} config={kpi} index={i} />
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-5 lg:items-stretch">
        <div className="min-h-[360px] lg:col-span-3">
          <PortfolioChart data={history} />
        </div>
        <div className="min-h-[360px] lg:col-span-2">
          <AllocationChart data={allocation} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TransactionsTable rows={txRows} />
        </div>
        <div className="min-h-0 xl:col-span-1">
          <TopMovers movers={movers} />
        </div>
      </div>
    </>
  )
}
