import { Request, Response, NextFunction } from 'express'
import { TokenUtils } from '../utils/TokenUtils'
import { CustomResponse } from '../utils/errorhandler'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return CustomResponse(
        res,
        false,
        'Authentication token is missing',
        null,
        401
      )
    }
    const decoded: any = TokenUtils.verifyToken(token, process.env.JWT_SECRET!)
    ;(req as any).user = {
      id: decoded.userId,
      roles: decoded.roles,
      blocked: decoded.blocked
    }
    return next()
  } catch (error: any) {
    return CustomResponse(
      res,
      false,
      'Invalid or expired authentication token',
      null,
      401
    )
  }
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
      return CustomResponse(res, false, 'Forbidden', null, 403)
    }
    return next()
  } catch (error: any) {
    return CustomResponse(res, false, 'Error checking admin role', null, 500)
  }
}

export const isblocked = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user && req.user.blocked) {
      return CustomResponse(res, false, 'User is blocked', null, 403)
    }
    return next()
  } catch (error: any) {
    return CustomResponse(res, false, 'Error checking user block status', null, 500)
  }
}

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.params.id || req.user.id !== req.params.id) {
      return CustomResponse(res, false, 'Not authorized', null, 403)
    }
    return next()
  } catch (error: any) {
    return CustomResponse(res, false, 'Error checking ownership', null, 500)
  }
}
