import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/SkeletonCard';
import { timeAgo, cn } from '@/lib/utils';
import api from '@/lib/api';

interface NotificationItem {
  id: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleItemClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // silent
      }
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary" />
            {t('notifications.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'All activity up to date'}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1.5">
            <CheckCheck className="h-4 w-4" />
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} className="h-20" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={t('notifications.empty')}
          description={t('notifications.emptyHint')}
        />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={cn(
                'p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4',
                n.isRead
                  ? 'bg-card border-border/70 hover:bg-secondary/40'
                  : 'bg-primary/5 border-primary/30 ring-1 ring-primary/20 shadow-xs'
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full mt-1.5 shrink-0',
                    n.isRead ? 'bg-muted-foreground/40' : 'bg-primary animate-pulse'
                  )}
                />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-muted-foreground font-mono mt-1 block">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
              </div>

              {n.link && (
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-60 hover:opacity-100" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
