import mongoose, { Schema, type Document, type Types } from 'mongoose'

/** One row per user per month label (Jan … Dec) for 12-month chart */
export interface IPortfolioHistory extends Document {
  userId: Types.ObjectId
  month: string
  value: number
  order: number
}

const portfolioHistorySchema = new Schema<IPortfolioHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    month: { type: String, required: true },
    value: { type: Number, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true },
)

portfolioHistorySchema.index({ userId: 1, order: 1 }, { unique: true })

export const PortfolioHistory = mongoose.model<IPortfolioHistory>(
  'PortfolioHistory',
  portfolioHistorySchema,
)
