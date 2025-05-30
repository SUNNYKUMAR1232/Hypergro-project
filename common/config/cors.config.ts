import cors, { CorsOptions } from 'cors'
import { Application } from 'express'

class CorsConfig {
  private options: CorsOptions

  constructor() {
    this.options = {
      origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Response-Time'], // Allowed headers
      credentials: true // Allow credentials
    }
  }

  public init(app: Application): void {
    app.use(cors(this.options))
  }
}

export default new CorsConfig()
