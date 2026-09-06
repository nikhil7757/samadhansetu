import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service.js';

export class NotificationController {
  static async list(req: Request, res: Response) {
    const notifications = await NotificationService.list(req.user!.userId);
    const unreadCount = await NotificationService.getUnreadCount(req.user!.userId);
    res.json({ notifications, unreadCount });
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      await NotificationService.markAsRead(req.params.id, req.user!.userId);
      res.json({ success: true });
    } catch (err: any) {
      if (err.message === 'Notification not found') {
        res.status(404).json({ error: err.message });
        return;
      }
      throw err;
    }
  }

  static async markAllAsRead(req: Request, res: Response) {
    await NotificationService.markAllAsRead(req.user!.userId);
    res.json({ success: true });
  }
}
