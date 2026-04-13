import { Router } from 'express'
import { body } from 'express-validator'
import * as transactionController from '../controllers/transactionController'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.use(authMiddleware)

router.get('/', asyncHandler(transactionController.list))

router.post(
  '/',
  validateRequest([
    body('asset').trim().notEmpty(),
    body('type').isIn(['buy', 'sell']),
    body('amount').isFloat({ gt: 0 }),
    body('price').isFloat({ gt: 0 }),
    body('date').optional().isISO8601(),
    body('status').optional().isIn(['completed', 'pending', 'failed']),
  ]),
  asyncHandler(transactionController.create),
)

router.get('/:id', asyncHandler(transactionController.getOne))

export default router
