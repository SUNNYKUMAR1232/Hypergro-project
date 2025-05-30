import mongoose from 'mongoose'
import './env.config'
class Database {
  private readonly URI: string
  private readonly RETRY_INTERVAL = 5000

  constructor() {
    this.URI = process.env.MONGO_URI || 'your mongo url'
    this.connect()
  }

  private async connect() {
    try {
      await mongoose.connect(this.URI)
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Database connection failed, retrying in 5 seconds...')
      setTimeout(() => {
        this.connect()
      }, this.RETRY_INTERVAL)
    }
  }
}
export default Database