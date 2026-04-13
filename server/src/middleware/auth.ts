import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { HttpError } from './errorHandler'
import type { AuthPayload } from './authTypes'

export type { AuthPayload }

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Unauthorized'))
    return
  }
  const token = header.slice(7)
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload & {
      sub?: string
    }
    req.user = {
      userId: decoded.userId || decoded.sub || '',
      email: decoded.email,
    }
    if (!req.user.userId) {
      next(new HttpError(401, 'Invalid token'))
      return
    }
    next()
  } catch {
    next(new HttpError(401, 'Invalid or expired token'))
  }
}
