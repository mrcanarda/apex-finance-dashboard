import type { ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

const HEADER: Record<string, { kicker: string; title: string }> = {
  '/': {
    kicker: 'Command center',
    title: 'Overview',
  },
  '/portfolio': { kicker: 'Workspace', title: 'Portfolio' },
  '/markets': { kicker: 'Workspace', title: 'Markets' },
  '/transactions': { kicker: 'Workspace', title: 'Transactions' },
  '/settings': { kicker: 'Workspace', title: 'Settings' },
}

function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <div key={location.pathname} className="route-fade">
      {children}
    </div>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const meta = HEADER[pathname] ?? {
    kicker: 'Workspace',
    title: 'Dashboard',
  }

  return (
    <div className="flex min-h-screen bg-app">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-edge bg-app/90 px-6 py-8 backdrop-blur-sm lg:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            {meta.kicker}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h1
              className="text-3xl font-normal tracking-tight text-fg sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {meta.title}
            </h1>
            <Link
              to="/login"
              className="shrink-0 font-mono text-xs text-accent hover:underline"
            >
              API sign-in
            </Link>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  )
}
