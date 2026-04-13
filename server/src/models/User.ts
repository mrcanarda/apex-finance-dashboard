import mongoose, { Schema, type Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  name: string
  plan: 'free' | 'pro'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  },
  { timestamps: true },
)

export const User = mongoose.model<IUser>('User', userSchema)
