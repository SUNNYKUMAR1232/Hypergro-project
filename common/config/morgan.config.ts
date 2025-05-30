import morgan from 'morgan'
import { Application } from 'express'

const morganConfig = {
  init(app: Application) {
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'))
    }
  }
}

export default morganConfig
