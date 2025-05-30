import User, { IUser } from '../models/user.model'
import { redisClient } from '../../common/config/redis.comfig'

export class UserService {
  async getUserById(userId: string) {
    return User.findById(userId).populate('recommendationsReceived')
  }

  async updateUser(userId: string, updatedData: Partial<IUser>) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    Object.assign(user, updatedData)
    await user.save()
    return user
  }

  async getUserRecommendations(userId: string) {
    const user = await User.findById(userId).populate('recommendationsReceived')
    if (!user) throw new Error('User not found')
    return user.recommendationsReceived
  }

  async logout(userId: string) {
    await redisClient.del(`refresh:${userId}`)
    return { message: 'Logged out successfully' }
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId)
    if (!user) throw new Error('User not found')
    await redisClient.del(`refresh:${userId}`)
    return { message: 'User deleted successfully' }
  }

  async getAllUsers() {
    return User.find().select('-passwordHash') // Exclude password hash
  }
  async userBlock(userId: string, block: boolean) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    user.blocked = block
    await user.save()
    return { message: `User ${block ? 'blocked' : 'unblocked'} successfully` }
  }
  async assignRole(userId: string, roles: string[]) {
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    const newRoles = roles.filter((role) => !user.roles.includes(role))
    if (newRoles.length > 0) {
      user.roles.push(...newRoles)
      await user.save()
      return { message: `Role(s) ${newRoles.join(', ')} assigned successfully` }
    }
    return { message: `User already has role(s) ${roles.join(', ')}` }
  }
}
