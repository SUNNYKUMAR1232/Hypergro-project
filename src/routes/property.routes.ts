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
import { authenticate } from '../middleware/auth.middleware'

const router = express.Router()

// 🔐 Create property (auth required)
router.post('/', authenticate, createProperty)

// 🌐 Get all properties (optionally with filters)
router.get('/', getAllProperties)

// 🔍 Search / advanced filtering (should be before :id to avoid conflicts)
router.get('/search', searchProperties)

// 🔎 Get single property by ID
router.get('/:id', getPropertyById)

// ✏️ Update property (only owner)
router.put('/:id', authenticate, updatePropertys)
router.put('/addUser/:id', authenticate, updatePropertyByUser)

// ❌ Delete property (only owner)
router.delete('/:id', authenticate, deleteProperty)

router.post('/recommend', authenticate, recommendProperty)
export default router
