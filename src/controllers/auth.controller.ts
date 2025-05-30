import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body
      const result = await authService.register(email, password, name)
      res.status(201).json(result)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json(result)
    } catch (err: any) {
      res.status(401).json({ error: err.message })
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refresh(refreshToken)
      res.json(result)
    } catch (err: any) {
      res.status(401).json({ error: err.message })
    }
  }

  static async initiateReset(req: Request, res: Response) {
    try {
      const { email } = req.body
      const result = await authService.initiateReset(email)
      res.json(result) // Would email in production
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { userId, token, newPassword } = req.body
      const result = await authService.resetPassword(userId, token, newPassword)
      res.json(result)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
  static async logout(req: Request, res: Response) {
    try {
      const { userId } = req.body
      await authService.logout(userId)
      res.json({ message: 'Logged out successfully' })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
