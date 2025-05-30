import User from '../models/user.model'
import { TokenUtils } from '../utils/TokenUtils'
import { redisClient } from '../../common/config/redis.comfig'

export class AuthService {
  async register(email: string, password: string, name?: string) {
    const user = new User({
      email,
      passwordHash: password,
      name
    })
    await user.save()
    return { message: 'User registered' }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials')
    }

    const accessToken = TokenUtils.generateAccessToken({ userId: user._id })
    const refreshToken = TokenUtils.generateRefreshToken({ userId: user._id })

    await redisClient.set(`refresh:${user._id}`, refreshToken, {
      EX: 1 * 86400
    }) // 1 days

    return { accessToken, refreshToken }
  }
  async logout(userId: string) {
    await redisClient.del(`refresh:${userId}`)
    return { message: 'Logged out successfully' }
  }
  async refresh(oldRefreshToken: string) {
    const decoded: any = TokenUtils.verifyToken(
      oldRefreshToken,
      process.env.REFRESH_SECRET!
    )
    const stored = await redisClient.get(`refresh:${decoded.userId}`)
    if (stored !== oldRefreshToken) throw new Error('Invalid refresh token')
    const newAccessToken = TokenUtils.generateAccessToken({
      userId: decoded.userId
    })
    var newRefreshToken = oldRefreshToken
    if (!stored) {
      const newRefreshToken = TokenUtils.generateRefreshToken({
        userId: decoded.userId
      })
      await redisClient.set(`refresh:${decoded.userId}`, newRefreshToken, {
        EX: 1 * 86400
      })
    }
    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async initiateReset(email: string) {
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')

    const resetToken = TokenUtils.generateResetToken()
    await redisClient.set(`reset:${user._id}`, resetToken, { EX: 30 }) // 30 second

    return { userId: user._id, resetToken }
  }

  async resetPassword(userId: string, token: string, newPassword: string) {
    const storedToken = await redisClient.get(`reset:${userId}`)
    if (storedToken !== token) throw new Error('Invalid or expired reset token')

    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    user.passwordHash = newPassword
    await user.save()
    await redisClient.del(`reset:${userId}`)

    return { message: 'Password reset successful' }
  }
}
