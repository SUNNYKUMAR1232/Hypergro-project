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
import { CustomResponse } from '../utils/errorhandler'

// Create property
export const createProperty = async (req: Request, res: Response) => {
  try {
    const newProperty = await createPropertys({
      ...req.body,
      createdBy: req.user!.id
    })
    return CustomResponse(res, true, 'Property created successfully', newProperty, 201)
  } catch (err) {
    console.error('Error creating property:', err)
    return CustomResponse(res, false, 'Error creating property', err, 500)
  }
}

// Get all properties
export const getAllProperties = async (_req: Request, res: Response) => {
  try {
    const properties = await getAllProperty()
    return CustomResponse(res, true, 'Properties fetched successfully', properties, 200)
  } catch (err) {
    console.error('Error fetching properties:', err)
    return CustomResponse(res, false, 'Error fetching properties', err, 500)
  }
}

// Get one property
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await PropertyById(req.params.id)
    if (!property)
      return CustomResponse(res, false, 'Property not found', null, 404)
    return CustomResponse(res, true, 'Property fetched successfully', property, 200)
  } catch (err) {
    console.error('Error fetching property:', err)
    return CustomResponse(res, false, 'Error fetching property', err, 500)
  }
}

// Update (only creator)
export const updatePropertys = async (req: Request, res: Response) => {
  try {
    const property = await updateProperty(req.params.id, req.user!.id, req.body)
    if (!property)
      return CustomResponse(res, false, 'Not authorized', null, 403)
    const allowedFields = [
      'title', 'type', 'price', 'state', 'city', 'areaSqFt', 'bedrooms', 'bathrooms',
      'amenities', 'furnished', 'availableFrom', 'listedBy', 'tags', 'colorTheme',
      'rating', 'isVerified', 'listingType'
    ]
    if (!Object.keys(req.body).every((key) => allowedFields.includes(key))) {
      return CustomResponse(res, false, 'Invalid fields in request body', null, 400)
    }
    return CustomResponse(res, true, 'Property updated successfully', property, 200)
  } catch (err) {
    return CustomResponse(res, false, 'Error updating property', err, 500)
  }
}

export const updatePropertyByUser = async (req: Request, res: Response) => {
  try {
    const result = await Property.findOneAndUpdate(
      { _id: req.params.id, createdBy: { $exists: false } },
      { $set: { createdBy: mongoose.Types.ObjectId.createFromHexString(req.body!.createdBy) } }
    )
    if (!result) {
      return CustomResponse(res, false, 'Owner present', null, 403)
    }
    return CustomResponse(res, true, 'Property owner updated successfully', result, 200)
  } catch (err) {
    return CustomResponse(res, false, 'Error updating property owner', err, 500)
  }
}

// Delete (only creator)
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const result = await deletePropertys(req.params.id, req.user!.id)
    if (!result)
      return CustomResponse(res, false, 'Not authorized', null, 403)
    return CustomResponse(res, true, 'Property deleted successfully', { deleted: true }, 200)
  } catch (err) {
    console.error('Delete failed:', err)
    return CustomResponse(res, false, 'Error deleting property', err, 500)
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
      return CustomResponse(
        res,
        true,
        'Properties fetched from cache',
        JSON.parse(typeof cachedData === 'string' ? cachedData : cachedData.toString()),
        200
      )
    }
    const result = await searchProperty(query)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(result))
    return CustomResponse(res, true, 'Properties fetched successfully', result, 200)
  } catch (err) {
    return CustomResponse(res, false, 'Error searching properties', err, 500)
  }
}

export const recommendProperty = async (req: Request, res: Response) => {
  const { email, propertyId } = req.body
  const recommendingUserId = req.user?.id

  try {
    const recipient = await userModel.findOne({ email })
    if (!recipient)
      return CustomResponse(res, false, 'Recipient not found', null, 404)
    const property = await Property.findById(propertyId)
    if (!property)
      return CustomResponse(res, false, 'Property not found', null, 404)

    if (recipient.recommendationsReceived.includes(propertyId)) {
      return CustomResponse(res, false, 'Property already recommended', null, 400)
    }

    if (!recommendingUserId) {
      return CustomResponse(res, false, 'Invalid recommending user', null, 400)
    }

    recipient.recommendationsReceived.push({
      fromUserId: mongoose.Types.ObjectId.createFromHexString(recommendingUserId),
      propertyId: mongoose.Types.ObjectId.createFromHexString(propertyId),
      date: new Date()
    })
    await recipient.save()

    return CustomResponse(res, true, 'Property recommended successfully', null, 200)
  } catch (err) {
    return CustomResponse(res, false, 'Error recommending property', err, 500)
  }
}
