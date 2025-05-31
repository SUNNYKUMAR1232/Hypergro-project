import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { CustomResponse } from '../utils/errorhandler'

const authService = new AuthService()

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body
      const result = await authService.register(email, password, name)
      return CustomResponse(res, true, "Registration successful", result, 201)
    } catch (err: any) {
      return CustomResponse(res, false, err.message || "Registration failed", null, 400)
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      return CustomResponse(res, true, "Login successful", result, 200)
    } catch (err: any) {
      return CustomResponse(res, false, err.message || "Login failed", null, 401)
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refresh(refreshToken)
      return CustomResponse(res, true, "Token refreshed successfully", result, 200)
    } catch (err: any) {
      return CustomResponse(res, false, err.message || "Token refresh failed", null, 401)
    }
  }

  static async initiateReset(req: Request, res: Response) {
    try {
      const { email } = req.body
      const result = await authService.initiateReset(email)
      return CustomResponse(res, true, "Password reset initiated", result, 200)
    } catch (err: any) {
      return CustomResponse(res, false, err.message || "Password reset initiation failed", null, 400)
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { userId, token, newPassword } = req.body
      const result = await authService.resetPassword(userId, token, newPassword)
      return CustomResponse(res, true, "Password reset successful", result, 200)
    } catch (err: any) {
      return CustomResponse(res, false, err.message || "Password reset failed", null, 400)
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { userId } = req.body
      await authService.logout(userId)
      return CustomResponse(res, true, "Logged out successfully", { message: 'Logged out successfully' }, 200)
    } catch (err: any) {
      return CustomResponse(res, false, err.message || "Logout failed", null, 400)
    }
  }
}
