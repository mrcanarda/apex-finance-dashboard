import type { Transaction } from '../data/mockData'

interface TransactionsTableProps {
  rows: Transaction[]
}

function TypeBadge({ type }: { type: Transaction['type'] }) {
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

function StatusPill({ status }: { status: Transaction['status'] }) {
  const map: Record<Transaction['status'], string> = {
    Completed: 'text-positive',
    Pending: 'text-accent',
    Failed: 'text-negative',
  }
  return (
    <span className={`font-mono text-xs ${map[status]}`}>{status}</span>
  )
}

export function TransactionsTable({ rows }: TransactionsTableProps) {
  return (
    <div className="animate-card-enter rounded-[12px] border border-edge bg-card shadow-card-inset transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(240,165,0,0.1),0_0_24px_-6px_rgba(240,165,0,0.25)] [animation-delay:400ms]">
      <div className="border-b border-edge px-6 py-5">
        <h2
          className="text-xl font-normal tracking-tight text-fg"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Recent transactions
        </h2>
        <p className="mt-1 font-mono text-xs text-muted">
          Latest 10 fills across accounts
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-medium">Asset</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
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
                <td className="px-6 py-3 font-medium tracking-tight">
                  {row.asset}
                </td>
                <td className="px-6 py-3">
                  <TypeBadge type={row.type} />
                </td>
                <td className="px-6 py-3 tabular-nums text-fg">{row.amount}</td>
                <td className="px-6 py-3 tabular-nums text-muted">
                  {row.price >= 1000
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(row.price)
                    : new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                      }).format(row.price)}
                </td>
                <td className="px-6 py-3 tabular-nums text-muted">{row.date}</td>
                <td className="px-6 py-3">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
