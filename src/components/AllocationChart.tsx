import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { AllocationSlice } from '../data/mockData'

interface AllocationChartProps {
  data: AllocationSlice[]
}

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: AllocationSlice }[]
}) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="rounded-lg border border-edge bg-card px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {p.name}
      </p>
      <p className="font-mono text-sm" style={{ color: p.payload.color }}>
        {p.value}%
      </p>
    </div>
  )
}

export function AllocationChart({ data }: AllocationChartProps) {
  return (
    <div className="animate-chart-enter flex h-full min-h-[320px] flex-col rounded-[12px] border border-edge bg-card p-6 shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.1),0_0_24px_-6px_rgba(240,165,0,0.28)]">
      <div className="mb-2">
        <h2
          className="text-xl font-normal tracking-tight text-fg"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Allocation
        </h2>
        <p className="mt-1 font-mono text-xs text-muted">By strategy bucket</p>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="h-[220px] w-full max-w-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="88%"
                paddingAngle={2}
                stroke="var(--bg-primary)"
                strokeWidth={2}
                isAnimationActive
                animationDuration={1000}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={<DonutTooltip />}
                animationDuration={200}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-4 grid w-full max-w-sm grid-cols-1 gap-2 sm:grid-cols-2">
          {data.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-2 font-mono text-[11px]"
            >
              <span className="flex min-w-0 items-center gap-2 text-muted">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="truncate">{s.name}</span>
              </span>
              <span className="shrink-0 text-fg">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
