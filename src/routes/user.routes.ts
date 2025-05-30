import { Request, Response, Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// User profile routes
router.get('/profile', authenticate, UserController.getProfile)
router.put('/profile', authenticate, UserController.updateProfile)
// Get all users (admin only)
router.get('/', authenticate, UserController.getAllUsers)
// User recommendations
router.get('/recommendations', authenticate, UserController.getRecommendations)

export default router
