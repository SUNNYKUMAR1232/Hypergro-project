import { Schema, model, Document } from 'mongoose'

export interface IProperty extends Document {
  title: string
  type: string
  price: number
  state: string
  city: string
  areaSqFt: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  furnished: boolean
  availableFrom: Date
  listedBy: string
  tags: string[]
  colorTheme: string
  rating: number
  isVerified: boolean
  listingType: string
  createdBy: Schema.Types.ObjectId
  dateCreated: Date
  dateUpdated: Date
}

const PropertySchema = new Schema<IProperty>({
  title: String,
  type: String,
  price: Number,
  state: String,
  city: String,
  areaSqFt: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  furnished: Boolean,
  availableFrom: Date,
  listedBy: String,
  tags: [String],
  colorTheme: String,
  rating: Number,
  isVerified: Boolean,
  listingType: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
})

export default model<IProperty>('Property', PropertySchema)
