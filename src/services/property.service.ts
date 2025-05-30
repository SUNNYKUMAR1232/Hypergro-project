import Property, { IProperty } from '../models/property.model'

export const createPropertys = async (
  data: Partial<IProperty>
): Promise<IProperty> => {
  const newProperty = new Property(data)
  return await newProperty.save()
}

export const getAllProperty = async (): Promise<IProperty[]> => {
  return await Property.find()
}

export const PropertyById = async (id: string): Promise<IProperty | null> => {
  return await Property.findById(id)
}

export const updateProperty = async (
  id: string,
  userId: string,
  updates: Partial<IProperty>
): Promise<IProperty | null> => {
  const property = await Property.findOne({ _id: id, createdBy: userId })
  if (!property) return null
  Object.assign(property, updates)
  property.dateUpdated = new Date()
  await property.save()
  return property
}

export const deletePropertys = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const result = await Property.deleteOne({ _id: id, createdBy: userId })
  return result.deletedCount === 1
}

export const searchProperty = async (
  query: Record<string, any>
): Promise<any> => {
  const filters: any = {}

  const allowedFilters = [
    'city',
    'state',
    'type',
    'priceMin',
    'priceMax',
    'bedrooms',
    'bathrooms',
    'furnished',
    'listingType',
    'isVerified',
    'tags',
    'ratingMin',
    'ratingMax'
  ]

  for (const key of allowedFilters) {
    if (query[key]) {
      if (key === 'priceMin' || key === 'priceMax') {
        filters.price = {
          ...(query.priceMin && { $gte: Number(query.priceMin) }),
          ...(query.priceMax && { $lte: Number(query.priceMax) })
        }
      } else if (key === 'furnished') {
        const val = String(query[key]).toLowerCase()
        filters.furnished = val === 'true' || val === 'furnished'
      } else if (key === 'isVerified') {
        filters.isVerified = String(query[key]).toLowerCase() === 'true'
      } else if (key === 'tags') {
        filters.tags = { $in: String(query[key]).split(',') }
      } else if (key === 'bedrooms' || key === 'bathrooms') {
        filters[key] = Number(query[key])
      } else if (query.ratingMin || query.ratingMax) {
        filters.rating = {
          ...(query.ratingMin && { $gte: Number(query.ratingMin) }),
          ...(query.ratingMax && { $lte: Number(query.ratingMax) })
        }
      } else {
        filters[key] = query[key]
      }
    }
  }

  // Pagination
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  // Sorting (e.g., sort=price:asc or rating:desc)
  let sort: any = {}
  if (query.sort) {
    const [field, direction] = String(query.sort).split(':')
    sort[field] = direction === 'desc' ? -1 : 1
  }

  const properties = await Property.find(filters)
    .skip(skip)
    .limit(limit)
    .sort(sort)
  return {
    total: await Property.countDocuments(filters),
    page,
    limit,
    properties
  }
}
