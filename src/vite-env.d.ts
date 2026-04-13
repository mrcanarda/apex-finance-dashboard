/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  /** When "true", attempts demo login on first load if no token exists */
  readonly VITE_AUTO_LOGIN_DEMO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
