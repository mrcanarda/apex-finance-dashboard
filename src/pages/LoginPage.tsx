import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@apex.com')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.login(email, password)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[12px] border border-edge bg-card p-8 shadow-card-inset">
      <h1
        className="text-2xl text-fg"
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
      >
        Sign in
      </h1>
      <p className="mt-2 font-mono text-sm text-muted">
        Demo account: demo@apex.com / demo1234 (after running{' '}
        <code className="text-accent">npm run seed</code> in /server)
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="font-mono text-[10px] uppercase tracking-wider text-muted"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-edge bg-input px-3 py-2 font-mono text-sm text-fg outline-none focus:border-accent/50"
            autoComplete="email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="font-mono text-[10px] uppercase tracking-wider text-muted"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-edge bg-input px-3 py-2 font-mono text-sm text-fg outline-none focus:border-accent/50"
            autoComplete="current-password"
          />
        </div>
        {error ? (
          <p className="font-mono text-sm text-negative">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent py-3 font-mono text-sm font-medium uppercase tracking-wide text-on-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-center font-mono text-xs text-muted">
        <Link to="/" className="text-accent hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  )
}
