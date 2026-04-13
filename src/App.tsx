import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import * as authApi from './api/auth'
import { getToken } from './api/token'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { MarketsPage } from './pages/MarketsPage'
import { OverviewPage } from './pages/OverviewPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { SettingsPage } from './pages/SettingsPage'
import { TransactionsPage } from './pages/TransactionsPage'

function AutoDemoLogin() {
  useEffect(() => {
    if (import.meta.env.VITE_AUTO_LOGIN_DEMO !== 'true') return
    if (getToken()) return
    void authApi.login('demo@apex.com', 'demo1234').catch(() => {
      /* API may be down — mock fallback on pages */
    })
  }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AutoDemoLogin />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
