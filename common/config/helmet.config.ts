import helmet from 'helmet'
import { Application } from 'express'

class HelmetConfig {
  public static init(app: Application): void {
    app.use(helmet())
    // Add additional Helmet configurations if needed
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'example.com'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: []
        }
      })
    )
  }
}

export default HelmetConfig
