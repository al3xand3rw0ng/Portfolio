import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead } from '../services/userNotificationService';
import { UserNotification, NotificationUpdatePayload } from '../types';
import useUserContext from './useUserContext';

/**
 * Represents the useNotificationPage hook that provides functionality
 * for the NotificationPage component.
 *
 * @returns notifications - An array of notifications
 * @returns handleMarkAsRead - Function to mark a notification as read
 * @returns handleNotificationClick - Function to handle the click event for a notification
 */
const useNotificationPage = () => {
  const { user, socket } = useUserContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  /**
   * Fetches the user's notifications from the server.
   */
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const notifs = await getNotifications(user?.username || '');
      if (Array.isArray(notifs)) {
        const formattedNotifications = notifs.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        const sortedNotifications = formattedNotifications.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      throw new Error('Error fetching notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleNotificationUpdate = (update: NotificationUpdatePayload) => {
      const newNotif: UserNotification = {
        ...update,
        isRead: false,
        createdAt: new Date(update.createdAt),
      };
      setNotifications(prev => [newNotif, ...prev]);
    };

    socket.on('notificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('notificationUpdate', handleNotificationUpdate);
    };
  });

  /**
   * Marks a notification as read.
   * @param nid - The ID of the notification to mark as read.
   */
  const handleMarkAsRead = async (nid: string) => {
    try {
      await markNotificationAsRead(nid);
      setNotifications(prev => prev.map(n => (n._id === nid ? { ...n, isRead: true } : n)));
    } catch (error) {
      throw new Error('Error marking notification as read');
    }
  };

  /**
   * Handles the click event for a notification.
   * @param notification - The notification to handle the click event for.
   */
  const handleNotificationClick = async (notification: UserNotification) => {
    try {
      if (notification.type === 'question') {
        if (notification.questionId) {
          navigate(`/question/${notification.questionId}`);
        }
      } else if (notification.type === 'request') {
        navigate('/social');
      }
      if (!notification.isRead) {
        await handleMarkAsRead(notification._id!);
        setNotifications(prev =>
          prev.map(n => (n._id === notification._id ? { ...n, isRead: true } : n)),
        );
      }
    } catch (error) {
      throw new Error('Error marking notification as read');
    }
  };

  return { notifications, handleMarkAsRead, handleNotificationClick };
};

export default useNotificationPage;
