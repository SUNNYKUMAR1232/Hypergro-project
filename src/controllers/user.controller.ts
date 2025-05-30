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
}
