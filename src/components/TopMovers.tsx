import { MiniSparkline } from './MiniSparkline'
import type { TopMover } from '../data/mockData'

interface TopMoversProps {
  movers: TopMover[]
}

export function TopMovers({ movers }: TopMoversProps) {
  return (
    <div className="animate-card-enter rounded-[12px] border border-edge bg-card shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.1),0_0_24px_-6px_rgba(240,165,0,0.25)] [animation-delay:500ms]">
      <div className="border-b border-edge px-6 py-5">
        <h2
          className="text-xl font-normal tracking-tight text-fg"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Top movers
        </h2>
        <p className="mt-1 font-mono text-xs text-muted">
          Session leaders · 5 names
        </p>
      </div>
      <ul className="divide-y divide-edge">
        {movers.map((m) => {
          const up = m.changePercent >= 0
          return (
            <li
              key={m.ticker}
              className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-row"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-semibold tracking-tight text-fg">
                    {m.ticker}
                  </span>
                  <span className="truncate font-mono text-[11px] text-muted">
                    {m.companyName}
                  </span>
                </div>
                <p
                  className="mt-1 font-mono text-lg tabular-nums text-accent"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {m.price >= 1000
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(m.price)
                    : new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      }).format(m.price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'inline-flex items-center gap-1 font-mono text-sm tabular-nums',
                    up ? 'text-positive' : 'text-negative',
                  ].join(' ')}
                >
                  {up ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M12 4l8 8h-5v8H9v-8H4l8-8z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M12 20l-8-8h5V4h6v8h5l-8 8z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {up ? '+' : ''}
                  {m.changePercent.toFixed(2)}%
                </span>
                <MiniSparkline data={m.sparkline} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
