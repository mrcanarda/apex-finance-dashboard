import { Router } from 'express'
import * as portfolioController from '../controllers/portfolioController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.use(authMiddleware)

router.get('/summary', asyncHandler(portfolioController.summary))
router.get('/holdings', asyncHandler(portfolioController.holdingsList))
router.get('/history', asyncHandler(portfolioController.history))

export default router
