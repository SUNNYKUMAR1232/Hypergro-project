import { Request, Response } from 'express'
import Property from '../models/property.model'
import mongoose from 'mongoose'
import {
  createPropertys,
  deletePropertys,
  getAllProperty,
  PropertyById,
  searchProperty,
  updateProperty
} from '../services/property.service'
import { redisClient } from '../../common/config/redis.comfig'
import userModel from '../models/user.model'

// Create property
export const createProperty = async (req: Request, res: Response) => {
  try {
    const newProperty = await createPropertys({
      ...req.body,
      createdBy: req.user!.id // Ensure the user is authenticated
    })
    res.status(201).json(newProperty)
  } catch (err) {
    console.error('Error creating property:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Get all properties (optionally filtered)
export const getAllProperties = async (_req: Request, res: Response) => {
  try {
    const properties = await getAllProperty()
    res.json(properties)
  } catch (err) {
    console.error('Error fetching properties:', err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Get one property
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await PropertyById(req.params.id)
    if (!property)
      return res.status(404).json({ message: 'Property not found' })
    return res.json(property)
  } catch (err) {
    console.error('Error fetching property:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Update (only creator)
export const updatePropertys = async (req: Request, res: Response) => {
  try {
    const property = await updateProperty(req.params.id, req.user!.id, req.body)
    if (!property) return res.status(403).json({ message: 'Not authorized' })
    // Only update allowed fields
    const allowedFields = [
      'title',
      'type',
      'price',
      'state',
      'city',
      'areaSqFt',
      'bedrooms',
      'bathrooms',
      'amenities',
      'furnished',
      'availableFrom',
      'listedBy',
      'tags',
      'colorTheme',
      'rating',
      'isVerified',
      'listingType'
    ]
    if (!Object.keys(req.body).every((key) => allowedFields.includes(key))) {
      return res.status(400).json({ message: 'Invalid fields in request body' })
    }
    return res.json(property)
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updatePropertyByUser = async (req: Request, res: Response) => {
  try {
    const result = await Property.findOneAndUpdate(
      { _id: req.params.id, createdBy: { $exists: false } },
      { $set: { createdBy: new mongoose.Types.ObjectId(req.body!.createdBy) } }
    )
    if (!result) {
      return res.status(403).json({ message: ' Owner present' })
    }
    return res.json(result)
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Delete (only creator)
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const result = await deletePropertys(req.params.id, req.user!.id)
    if (!result) return res.status(403).json({ message: 'Not authorized' })
    return res.json({ deleted: true })
  } catch (err) {
    console.error('Delete failed:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// Search properties with advanced filtering
export const searchProperties = async (req: Request, res: Response) => {
  try {
    const query = req.query
    const cacheKey = `properties:${JSON.stringify(req.query)}`
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      console.log('📦 Returning cached data')
      return res.json(JSON.parse(cachedData))
    }
    const result = await searchProperty(query)
    //  Store result in cache for 10 minutes
    await redisClient.setEx(cacheKey, 600, JSON.stringify(result))
    return res.json(result)
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err })
  }
}

export const recommendProperty = async (req: Request, res: Response) => {
  const { email, propertyId } = req.body
  const recommendingUserId = req.user?.id

  try {
    const recipient = await userModel.findOne({ email })
    if (!recipient)
      return res.status(404).json({ message: 'Recipient not found' })
    const property = await Property.findById(propertyId)
    if (!property)
      return res.status(404).json({ message: 'Property not found' })

    // Prevent duplicate recommendations
    if (recipient.recommendationsReceived.includes(propertyId)) {
      return res.status(400).json({ message: 'Property already recommended' })
    }

    if (!recommendingUserId) {
      return res.status(400).json({ message: 'Invalid recommending user' })
    }

    recipient.recommendationsReceived.push({
      fromUserId: new mongoose.Types.ObjectId(recommendingUserId),
      propertyId: new mongoose.Types.ObjectId(propertyId),
      date: new Date()
    })
    await recipient.save()

    return res
      .status(200)
      .json({ message: 'Property recommended successfully' })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err })
  }
}
