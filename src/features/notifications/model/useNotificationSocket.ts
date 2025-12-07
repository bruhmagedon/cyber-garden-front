
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/store/authStore';
import { getWebSocketUrl } from '@/shared/config/api/config';

export interface Notification {
  id: string;
  type: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export const useNotificationSocket = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.access_token);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const wsUrl = `${getWebSocketUrl()}/api/ws/notifications?token=${accessToken}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Notification WebSocket connected');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle the specific incoming format
        // { user_id: "...", text: "...", type: "..." }
        const newNotification: Notification = {
            id: crypto.randomUUID(), // Generate unique ID to fix deletion bug
            type: data.type || 'system',
            text: data.text || '', 
            createdAt: new Date().toISOString(),
            read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);

      } catch (error) {
        console.error('Error parsing notification message:', error);
      }
    };

    socket.onclose = () => {
      console.log('Notification WebSocket disconnected');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [accessToken]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

    const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification
  };
};
