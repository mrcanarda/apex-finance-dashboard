import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

type Currency = 'USD' | 'EUR' | 'GBP' | 'TRY'

/** Profile + preferences — theme is global; other prefs are local UI state */
export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [currency, setCurrency] = useState<Currency>('USD')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return
    const t = window.setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(t)
  }, [saved])

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <section className="rounded-[12px] border border-edge bg-card p-8 shadow-card-inset">
        <h2
          className="text-xl font-normal tracking-tight text-fg"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Profile
        </h2>
        <p className="mt-1 font-mono text-xs text-muted">
          Account details (read-only)
        </p>

        <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-edge bg-sidebar font-mono text-xl text-accent"
            aria-hidden
          >
            JD
          </div>
          <div className="min-w-0 space-y-1">
            <p
              className="text-2xl text-fg"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Jordan Drake
            </p>
            <p className="font-mono text-sm text-muted">
              jordan.drake@apexwealth.test
            </p>
          </div>
        </div>

        <dl className="mt-10 space-y-4 border-t border-edge pt-8">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Name
            </dt>
            <dd className="mt-1 font-mono text-sm text-fg">Jordan Drake</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Email
            </dt>
            <dd className="mt-1 font-mono text-sm text-fg">
              jordan.drake@apexwealth.test
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Plan
            </dt>
            <dd className="mt-1 font-mono text-sm text-fg">Pro tier</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[12px] border border-edge bg-card p-8 shadow-card-inset">
        <h2
          className="text-xl font-normal tracking-tight text-fg"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          Preferences
        </h2>
        <p className="mt-1 font-mono text-xs text-muted">
          Theme applies across the app and is saved in this browser.
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Theme
            </p>
            <div className="mt-3 flex gap-2">
              {(['dark', 'light'] as const).map((t) => {
                const active = theme === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={[
                      'rounded-lg border px-4 py-2 font-mono text-xs capitalize transition-colors',
                      active
                        ? 'border-accent bg-accent text-on-accent'
                        : 'border-edge bg-card text-muted hover:text-fg',
                    ].join(' ')}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="font-mono text-[10px] uppercase tracking-wider text-muted"
            >
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="mt-3 w-full max-w-xs rounded-lg border border-edge bg-input px-3 py-2 font-mono text-sm text-fg outline-none focus:border-accent/50"
            >
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="TRY">TRY — Turkish Lira</option>
            </select>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Notifications
            </p>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-edge bg-row px-4 py-3">
              <span className="font-mono text-sm text-fg">Email summaries</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-edge bg-row px-4 py-3">
              <span className="font-mono text-sm text-fg">Push price alerts</span>
              <input
                type="checkbox"
                checked={pushAlerts}
                onChange={(e) => setPushAlerts(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
            </label>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-edge pt-8">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="rounded-lg bg-accent px-8 py-3 font-mono text-sm font-medium uppercase tracking-wide text-on-accent transition-opacity hover:opacity-90"
          >
            Save preferences
          </button>
          {saved ? (
            <span className="font-mono text-sm text-positive" role="status">
              Saved!
            </span>
          ) : null}
        </div>
      </section>
    </div>
  )
}
