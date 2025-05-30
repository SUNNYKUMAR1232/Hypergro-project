import mongoose, { Schema, Document, Types } from 'mongoose'
import bcrypt from 'bcrypt'

export interface Recommendation {
  fromUserId: Types.ObjectId
  propertyId: Types.ObjectId
  date: Date
}

export interface IUser extends Document {
  email: string
  passwordHash: string
  name?: string
  favorites: Types.ObjectId[]
  recommendationsReceived: Recommendation[]
  dateCreated: Date
  dateUpdated: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  recommendationsReceived: [
    {
      fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
      propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
      date: { type: Date, default: Date.now }
    }
  ],
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now }
})

// Hash password on save
UserSchema.pre('save', async function (next) {
  const user = this as IUser
  if (!user.isModified('passwordHash')) return next()
  user.passwordHash = await bcrypt.hash(user.passwordHash, 10)
  user.dateUpdated = new Date()
  next()
})

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model<IUser>('User', UserSchema)
