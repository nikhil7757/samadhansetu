import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      if (err.message === 'Email already registered') {
        res.status(409).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err: any) {
      if (err.message === 'Invalid email or password') {
        res.status(401).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async me(req: Request, res: Response) {
    const user = await AuthService.getMe(req.user!.userId);
    res.json(user);
  }
}
