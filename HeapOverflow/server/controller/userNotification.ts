import express, { Request, Response } from 'express';
import { FakeSOSocket } from '../types';
import UserModel from '../models/users';
import UserNotificationModel from '../models/userNotifications';

/**
 * Creates a notification for each recipient in the list of recipients.
 * @param socket - The FakeSOSocket object used to manage the WebSocket connection.
 * @param recipients - The list of usernames to send the notification to.
 * @param sender - The username of the sender.
 * @param content - The content of the notification.
 */
export const createNotification = async (
  socket: FakeSOSocket,
  recipients: string[],
  sender: string,
  content: string,
  type: 'question' | 'request',
  questionId?: string,
): Promise<void> => {
  if (recipients.length === 0) {
    return;
  }

  const notifications = recipients.map(recipient => ({
    sender,
    recipient,
    content,
    type,
    questionId: questionId ? questionId.toString() : null,
    isRead: false,
    createdAt: new Date(),
  }));

  const savedNotifications = await UserNotificationModel.insertMany(notifications);

  await Promise.all(
    savedNotifications.map(notification =>
      UserModel.findOneAndUpdate(
        { username: notification.recipient },
        { $push: { notifications: notification._id } },
      ),
    ),
  );

  recipients.forEach((recipient: string) => {
    socket.emit('notificationUpdate', {
      sender,
      recipient,
      content,
      type,
      questionId: questionId || undefined,
      createdAt: new Date(),
    });
  });
};

/**
 * Controller for the notification endpoint.
 * @param socket - The FakeSOSocket object used to manage the WebSocket connection.
 * @returns - An Express router with the notification routes.
 */
const userNotificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves all notifications for a user.
   * @param req - The request object containing the username.
   * @param res - The response object used to send back the result of the operation.
   */
  const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
    try {
      const notifications = await UserNotificationModel.find({ recipient: username }).sort({
        createdAt: -1,
      });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).send('Error when retrieving notifications');
    }
  };

  /**
   * Marks a notification as read.
   * @param req - The request object containing the notification ID.
   * @param res - The response object used to send back the result of the operation.
   */
  const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    const { nid } = req.body;

    try {
      await UserNotificationModel.findByIdAndUpdate(nid, { isRead: true });
      socket.emit('readNotificationUpdate', nid.toString());
      res.status(200).send('Notification marked as read');
    } catch (error) {
      res.status(500).send('Error when marking notification as read');
    }
  };

  router.get('/getNotifications', getNotifications);
  router.post('/markAsRead', markNotificationAsRead);

  return router;
};

export default userNotificationController;
