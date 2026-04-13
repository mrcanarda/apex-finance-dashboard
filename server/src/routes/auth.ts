import { Router } from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'
import { validateRequest } from '../middleware/validateRequest'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.post(
  '/register',
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ]),
  asyncHandler(authController.register),
)

router.post(
  '/login',
  validateRequest([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  asyncHandler(authController.login),
)

router.get('/me', authMiddleware, asyncHandler(authController.me))

export default router
