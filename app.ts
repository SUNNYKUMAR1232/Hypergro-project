import express, { Application, Request, Response, NextFunction } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import BodyParser from 'body-parser'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import createHttpError from 'http-errors'
import morganConfig from './common/config/morgan.config'
import HelmetConfig from './common/config/helmet.config'
import corsConfig from './common/config/cors.config'
import loadEnvironmentVariables from './common/config/env.config'
import Database from './common/config/db.config'
import authRoutes from './src/routes/auth.routes'
import propertyRoutes from './src/routes/property.routes'
import userRoutes from './src/routes/user.routes'
import compression from 'compression'
class App {
  private readonly App: Application = express()
  private readonly PORT: string | number = process.env.PORT || 5000
  private readonly HOST: string = process.env.HOST || 'localhost'

  constructor() {
    this.init()
  }

  private async init() {
    this.initConfig()
    this.initMiddlewares()
    this.initRoutes()
    this.initErrorHandling()
  }

  private initConfig() {
    morganConfig.init(this.App)
    HelmetConfig.init(this.App)
    corsConfig.init(this.App)
    loadEnvironmentVariables()
    new Database() // Initialize the database connection
  }

  private initMiddlewares() {
    this.App.use(express.json())
    this.App.use(BodyParser.json())
    this.App.use(BodyParser.urlencoded({ extended: true }))
    this.App.use(cookieParser())
    this.App.use(cors())
    this.App.use(compression())
    // Only apply CSRF to non-API routes
    this.App.use((req, res, next) => {
      if (req.path.startsWith('/api')) return next()
      return csrf({ cookie: true })(req, res, next)
    })
  }

  private initRoutes() {
    //this.App.use('/api/v1/', require('./routes/index').default);
    this.App.use('/api/v1/auth', authRoutes)
    this.App.use('/api/v1/property', propertyRoutes)
    this.App.use('/api/v1/user', userRoutes)
    // Example route

    this.App.get('/', (_: Request, res: Response) => {
      res.status(200).json({ message: 'Welcome to the API!' })
    })
  }

  private initErrorHandling() {
    // Middleware for handling 404 errors
    this.App.use((_req: Request, _res: Response, next: NextFunction) => {
      next(createHttpError(404))
    })
  }

  public listen() {
    this.App.listen(this.PORT, () => {
      console.log(`Server is running on http://${this.HOST}:${this.PORT}`)
    })
  }
}

export default App
