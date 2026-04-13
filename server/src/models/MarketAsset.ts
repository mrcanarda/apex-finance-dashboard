import mongoose, { Schema, type Document } from 'mongoose'

export interface IMarketAsset extends Document {
  symbol: string
  name: string
  type: 'stock' | 'crypto'
  price: number
  change24h: number
  changePercent24h: number
  marketCap: number
  volume: number
}

const marketAssetSchema = new Schema<IMarketAsset>(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['stock', 'crypto'], required: true },
    price: { type: Number, required: true },
    change24h: { type: Number, required: true },
    changePercent24h: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    volume: { type: Number, required: true },
  },
  { timestamps: true },
)

export const MarketAsset = mongoose.model<IMarketAsset>('MarketAsset', marketAssetSchema)
