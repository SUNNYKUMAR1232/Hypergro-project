import { Request, Response, NextFunction } from 'express'
import { TokenUtils } from '../utils/TokenUtils'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const decoded: any = TokenUtils.verifyToken(token, process.env.JWT_SECRET!)
    // Ensure req.user exists and assign id
    ;(req as any).user = {
      id: decoded.userId,
      roles: decoded.roles,
      blocked: decoded.blocked
    }
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming req.user is set by the authenticate middleware
    if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    return next()
  } catch (err) {
    console.error('Admin check error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const isblocked = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming req.user is set by the authenticate middleware
    if (req.user && req.user.blocked) {
      return res.status(403).json({ error: 'User is blocked' })
    }
    return next()
  } catch (err) {
    console.error('Block user check error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming req.user is set by the authenticate middleware
    if (!req.user || !req.params.id || req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized' })
    }
    return next()
  } catch (err) {
    console.error('Owner check error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
