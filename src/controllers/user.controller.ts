import { Request, Response } from 'express'
import { UserService } from '../services/user.service'
import { CustomResponse } from '../utils/errorhandler'
const userService = new UserService()

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const user = await userService.getUserById(userId)
      if (!user) {
        return CustomResponse(res, false, 'User not found', null, 404)
      }
      return CustomResponse(res, true, 'User profile fetched successfully', user, 200)
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }

  static async getAllUsers(_: Request, res: Response) {
    try {
      const users = await userService.getAllUsers()
      return CustomResponse(res, true, 'All users fetched successfully', users, 200)
    } catch (err: any) {
      console.error('Error fetching all users:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const updatedData = req.body
      const updatedUser = await userService.updateUser(userId, updatedData)
      if (!updatedUser) {
        return CustomResponse(res, false, 'User not found', null, 404)
      }
      return CustomResponse(res, true, 'User profile updated successfully', updatedUser, 200)
    } catch (err: any) {
      console.error('Error updating user profile:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const recommendations = await userService.getUserRecommendations(userId)
      return CustomResponse(res, true, 'User recommendations fetched successfully', recommendations, 200)
    } catch (err) {
      return CustomResponse(res, false, 'Server error', err, 500)
    }
  }

  static async userBlockByAdmin(req: Request, res: Response) {
    try {
      const userId = req.params.id
      const block = req.body.blocked
      const result = await userService.userBlock(userId, block)
      return CustomResponse(res, true, 'User block status updated', result, 200)
    } catch (err: any) {
      console.error('Error blocking/unblocking user:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }

  static async assignRoleByAdmin(req: Request, res: Response) {
    try {
      const userId = req.params.id
      const roles = req.body.roles
      const result = await userService.assignRole(userId, roles)
      return CustomResponse(res, true, 'User roles updated', result, 200)
    } catch (err: any) {
      console.error('Error assigning role:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const result = await userService.logout(userId)
      return CustomResponse(res, true, 'User logged out successfully', result, 200)
    } catch (err: any) {
      console.error('Error logging out:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const result = await userService.deleteUser(userId)
      return CustomResponse(res, true, 'User deleted successfully', result, 200)
    } catch (err: any) {
      console.error('Error deleting user:', err)
      return CustomResponse(res, false, 'Internal Server Error', err, 500)
    }
  }
}
