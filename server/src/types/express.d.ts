import type { AuthPayload } from '../middleware/authTypes'

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload
  }
}

export {}
