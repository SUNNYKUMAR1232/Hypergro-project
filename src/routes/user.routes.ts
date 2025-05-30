import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { authenticate, isOwner, adminOnly } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// User profile routes
router.get('/profile', authenticate, asyncHandler(UserController.getProfile))
router.put(
  '/profile',
  authenticate,
  adminOnly,
  asyncHandler(UserController.updateProfile)
)
// Admin block/unblock user
router.put(
  '/block/:id',
  authenticate,
  adminOnly,
  asyncHandler(UserController.userBlockByAdmin)
)
// Admin assign role (e.g., user, admin)
router.put(
  '/role/:id',
  authenticate,
  adminOnly,
  asyncHandler(UserController.assignRoleByAdmin)
)

router.delete(
  '/delete/:id',
  authenticate,
  adminOnly,
  asyncHandler(UserController.deleteUser)
)
// logout route
router.post('/logout', authenticate, asyncHandler(UserController.logout))
// Get all users (admin only)
router.get('/', authenticate, asyncHandler(UserController.getAllUsers))
// User recommendations
router.get(
  '/recommendations',
  authenticate,
  asyncHandler(UserController.getRecommendations)
)

export default router
