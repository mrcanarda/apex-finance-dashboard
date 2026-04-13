import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface ITransaction extends Document {
  userId: Types.ObjectId
  asset: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  date: Date
  status: 'completed' | 'pending' | 'failed'
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    asset: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    amount: { type: Number, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true },
)

transactionSchema.index({ userId: 1, date: -1 })
transactionSchema.index({ userId: 1, asset: 1 })

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)
