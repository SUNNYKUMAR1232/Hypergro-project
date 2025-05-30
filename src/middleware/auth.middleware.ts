import { Request, Response, NextFunction } from 'express'
import { TokenUtils } from '../utils/TokenUtils'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const decoded: any = TokenUtils.verifyToken(token, process.env.JWT_SECRET!)
    // Ensure req.user exists and assign id
    ;(req as any).user = { id: decoded.userId }
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
