import { UserNotification } from '../types';
import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Function to get notifications for a user.
 * @param username - The username of the user to get notifications for.
 * @returns - A list of notifications for the user.
 */
const getNotifications = async (username: string): Promise<UserNotification[]> => {
  const res = await api.get(`${NOTIFICATION_API_URL}/getNotifications?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching notifications');
  }
  return res.data;
};

/**
 * Function to mark a notification as read.
 * @param nid - The ID of the notification to mark as read.
 * @returns - A promise that resolves when the notification is marked as read.
 */
const markNotificationAsRead = async (nid: string): Promise<void> => {
  const res = await api.post(`${NOTIFICATION_API_URL}/markAsRead`, { nid });
  if (res.status !== 200) {
    throw new Error('Error when marking notification as read');
  }
  return res.data;
};

export { getNotifications, markNotificationAsRead };
