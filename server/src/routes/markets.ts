import { Router } from 'express'
import * as marketController from '../controllers/marketController'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.get('/', asyncHandler(marketController.list))
router.get('/:symbol', asyncHandler(marketController.getOne))

export default router
