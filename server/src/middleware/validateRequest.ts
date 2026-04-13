import type { NextFunction, Request, Response } from 'express'
import { validationResult, type ValidationChain } from 'express-validator'
import { HttpError } from './errorHandler'

export function validateRequest(validations: ValidationChain[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((v) => v.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      next(new HttpError(400, 'Validation failed', errors.array()))
      return
    }
    next()
  }
}
