import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { HttpError } from '../middleware/errorHandler'
import { User } from '../models/User'

function signToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body as {
    email: string
    password: string
    name: string
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw new HttpError(409, 'Email already registered')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    plan: 'free',
  })

  const token = signToken(user._id.toString(), user.email)
  res.status(201).json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      plan: user.plan,
      createdAt: user.createdAt,
    },
  })
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string }

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    throw new HttpError(401, 'Invalid email or password')
  }

  const token = signToken(user._id.toString(), user.email)
  res.json({
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      plan: user.plan,
      createdAt: user.createdAt,
    },
  })
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!.userId).select('-passwordHash')
  if (!user) {
    throw new HttpError(404, 'User not found')
  }
  res.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      plan: user.plan,
      createdAt: user.createdAt,
    },
  })
}
