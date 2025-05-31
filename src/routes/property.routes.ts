import express from 'express'
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updatePropertys,
  deleteProperty,
  searchProperties,
  updatePropertyByUser,
  recommendProperty
} from '../controllers/property.controller'
import { adminOnly, authenticate, isblocked, isOwner } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = express.Router()

router.post('/', authenticate, asyncHandler(createProperty))
router.get('/', asyncHandler(getAllProperties))
router.get('/search', asyncHandler(searchProperties))
router.get('/:id', asyncHandler(getPropertyById))

router.put('/:id', authenticate,isblocked,isOwner, asyncHandler(updatePropertys))
router.put('/addUser/:id', authenticate,isblocked,isOwner, asyncHandler(updatePropertyByUser))

router.delete('/:id', authenticate,isblocked,adminOnly, asyncHandler(deleteProperty))

router.post('/recommend', authenticate, asyncHandler(recommendProperty))
export default router
