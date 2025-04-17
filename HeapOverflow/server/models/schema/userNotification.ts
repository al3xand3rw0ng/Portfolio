import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure for storing notifications in the database.
 * Each notification includes the following fields:
 */
const userNotificationSchema: Schema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['question', 'request'],
      required: true,
    },
    questionId: {
      type: String,
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'UserNotification' },
);

export default userNotificationSchema;
