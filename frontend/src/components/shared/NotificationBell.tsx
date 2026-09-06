import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    const fetchCount = async () => {
      try {
        const res = await api.get('/notifications');
        if (isMounted) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        // Silently ignore notification poll errors
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 25000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  if (!user) return null;

  return (
    <button
      type="button"
      onClick={() => navigate('/notifications')}
      className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute 0 top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-xs animate-in zoom-in">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
