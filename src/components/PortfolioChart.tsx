import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PortfolioPoint } from '../data/mockData'

interface PortfolioChartProps {
  data: PortfolioPoint[]
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const v = payload[0].value
  return (
    <div className="rounded-lg border border-edge bg-card px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="font-mono text-sm text-accent">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(v)}
      </p>
    </div>
  )
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <div className="animate-chart-enter flex h-full min-h-[320px] flex-col rounded-[12px] border border-edge bg-card p-6 shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.1),0_0_24px_-6px_rgba(240,165,0,0.28)]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-normal tracking-tight text-fg"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Portfolio value
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">
            Last 12 months · normalized growth
          </p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          Live range
        </p>
      </div>
      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fill: 'var(--text-secondary)',
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
              }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tickFormatter={(n) => `$${(n / 1000).toFixed(0)}k`}
              tick={{
                fill: 'var(--text-secondary)',
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
              }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
              animationDuration={200}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-line)"
              strokeWidth={2}
              fill="url(#portfolioFill)"
              isAnimationActive
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
