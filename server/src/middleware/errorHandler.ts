import type { ErrorRequestHandler } from 'express'

export class HttpError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
    this.name = 'HttpError'
  }
}

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.details !== undefined ? { details: err.details } : {}),
    })
    return
  }

  const message =
    err instanceof Error ? err.message : 'Internal server error'
  console.error(err)
  res.status(500).json({ error: message })
}
