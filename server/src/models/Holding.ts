import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IHolding extends Document {
  userId: Types.ObjectId
  asset: string
  shares: number
  avgBuyPrice: number
  currentPrice: number
  totalValue: number
  pnl: number
  pnlPercent: number
}

const holdingSchema = new Schema<IHolding>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    asset: { type: String, required: true, uppercase: true, trim: true },
    shares: { type: Number, required: true },
    avgBuyPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    pnl: { type: Number, required: true },
    pnlPercent: { type: Number, required: true },
  },
  { timestamps: true },
)

holdingSchema.index({ userId: 1, asset: 1 }, { unique: true })

export const Holding = mongoose.model<IHolding>('Holding', holdingSchema)
