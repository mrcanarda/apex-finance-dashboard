import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyStoredThemeToDocument } from './context/themeBootstrap'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

applyStoredThemeToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
