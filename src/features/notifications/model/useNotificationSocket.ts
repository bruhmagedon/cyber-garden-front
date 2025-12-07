import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/model/store/authStore';
import { getWebSocketUrl } from '@/shared/config/api/config';

export interface Notification {
  id: number;
  type: 'budget_limit' | 'system';
  payload: string;
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

    const wsUrl = `${getWebSocketUrl()}/notifications/ws?token=${accessToken}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Notification WebSocket connected');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Assuming the backend sends a single notification object or a list
        // Adjust based on actual backend format.
        // For now, let's assume it sends a new notification object.
        const newNotification = {
            ...data,
            read: false,
             // Ensure id exists or generate one if missing (though backend usually provides it)
             // and ensure other fields are present.
             // If payload is a string, keep it. If object, maybe stringify or extract message?
             // The mock data had payload as simple content.
             // We might need to map backend data to our Notification interface if they differ.
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

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

    const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: number) => {
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
