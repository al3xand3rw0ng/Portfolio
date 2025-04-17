import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { getNotifications } from '../services/userNotificationService';

/**
 * Represents the useUnreadNotifCount hook that provides functionality
 * for the NotificationPage component.
 *
 * @returns unreadCount - The number of unread notifications
 * @returns setUnreadCount - Function to set the unread notification count
 */
const useUnreadNotifCount = () => {
  const { user, socket } = useUserContext();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;

      try {
        const notifs = await getNotifications(user.username);
        const count = notifs.filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (error) {
        throw new Error('Error fetching unread notification count');
      }
    };

    if (user) {
      fetchUnreadCount();
    }

    /**
     * Function to handle notification updates.
     */
    const handleNotificationUpdate = ({
      recipient,
      type,
      questionId,
    }: {
      recipient: string;
      type: string;
      questionId?: string;
    }) => {
      if (recipient === user.username) {
        fetchUnreadCount();
      }
    };

    /**
     * Function to handle read notification updates.
     */
    const handleReadNotificationUpdate = ({ nid }: { nid: string }) => {
      fetchUnreadCount();
    };

    socket.on('notificationUpdate', handleNotificationUpdate);
    socket.on('readNotificationUpdate', handleReadNotificationUpdate);

    return () => {
      socket.off('notificationUpdate');
      socket.off('readNotificationUpdate');
    };
  }, [user, socket]);

  return { unreadCount, setUnreadCount };
};

export default useUnreadNotifCount;
