import { Request, Response, Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refresh)
router.post('/reset/initiate', AuthController.initiateReset)
router.post('/reset/confirm', AuthController.resetPassword)
router.get('/', authenticate, (_req, res) => {
  res.status(200).json({ message: 'Welcome to the API!' })
})
export default router
