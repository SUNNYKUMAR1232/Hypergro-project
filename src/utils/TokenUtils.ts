import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export class TokenUtils {
  static generateAccessToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '12m' })
  }

  static generateRefreshToken(payload: object) {
    return jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: '1d' })
  }

  static verifyToken(token: string, secret: string) {
    return jwt.verify(token, secret)
  }

  static generateResetToken() {
    return crypto.randomBytes(32).toString('hex')
  }
}
