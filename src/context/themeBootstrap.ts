export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'apex-theme'

export function getStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/** Call once in main.tsx before render to avoid light→dark flash */
export function applyStoredThemeToDocument() {
  applyThemeClass(getStoredTheme())
}
