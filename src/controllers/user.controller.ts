import { Request, Response } from 'express'
import { UserService } from '../services/user.service'

const userService = new UserService()

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id // Assuming user ID is stored in req.user
      const user = await userService.getUserById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json(user)
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async getAllUsers(_: Request, res: Response) {
    try {
      const users = await userService.getAllUsers()
      return res.status(200).json(users)
    } catch (err: any) {
      console.error('Error fetching all users:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const updatedData = req.body // Ensure to validate this data
      const updatedUser = await userService.updateUser(userId, updatedData)
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.json(updatedUser)
    } catch (err: any) {
      console.error('Error updating user profile:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const recommendations = await userService.getUserRecommendations(userId)
      return res.status(200).json(recommendations)
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err })
    }
  }
  static async userBlockByAdmin(req: Request, res: Response) {
    try {
      const userId = req.params.id // Assuming the user ID is passed in the URL
      const block = req.body.blocked // Expecting { block: true/false }
      const result = await userService.userBlock(userId, block)
      return res.status(200).json(result)
    } catch (err: any) {
      console.error('Error blocking/unblocking user:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async assignRoleByAdmin(req: Request, res: Response) {
    try {
      const userId = req.params.id // Assuming the user ID is passed in the URL
      const roles = req.body.roles // Expecting { roles: ['role1', 'role2'] }
      const result = await userService.assignRole(userId, roles)
      return res.status(200).json(result)
    } catch (err: any) {
      console.error('Error assigning role:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async logout(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const result = await userService.logout(userId)
      return res.status(200).json(result)
    } catch (err: any) {
      console.error('Error logging out:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const result = await userService.deleteUser(userId)
      return res.status(200).json(result)
    } catch (err: any) {
      console.error('Error deleting user:', err)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
