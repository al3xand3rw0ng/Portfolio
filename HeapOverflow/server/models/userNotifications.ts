// Notification Document Schema
import mongoose, { Model } from 'mongoose';
import userNotificationSchema from './schema/userNotification';
import { UserNotification } from '../types';

/**
 * Mongoose model for the `Notification` collection.
 *
 * This model is created using the `Notification` interface and the `notificationSchema`, representing the
 * `Notification` collection in the MongoDB database, and provides an interface for interacting with
 * the stored notifications.
 *
 * @type {Model<UserNotification>}
 */
const UserNotificationModel: Model<UserNotification> = mongoose.model<UserNotification>(
  'UserNotification',
  userNotificationSchema,
);

export default UserNotificationModel;
