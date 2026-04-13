import { Link, NavLink } from 'react-router-dom'

const NAV: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Overview', end: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/markets', label: 'Markets' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-edge bg-sidebar px-5 py-8">
      <Link to="/" className="mb-10 block px-1">
        <p
          className="text-2xl tracking-tight text-fg"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Apex
          <span className="text-accent">.</span>
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Private Wealth
        </p>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'rounded-xl py-2.5 pl-3 pr-3 text-left font-mono text-sm transition-colors duration-200 border-l-2',
                isActive
                  ? 'border-accent bg-card text-accent'
                  : 'border-transparent text-muted hover:bg-card/60 hover:text-fg',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-edge pt-6">
        <div className="flex items-center gap-3 px-1">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-edge bg-card font-mono text-sm text-accent"
            aria-hidden
          >
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm text-fg">Jordan Drake</p>
            <p className="truncate font-mono text-xs text-muted">Pro tier</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
