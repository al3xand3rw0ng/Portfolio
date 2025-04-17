import { Schema } from 'mongoose';
/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `picture`: The URL of the user's profile picture.
 * - `username`: The username of that user.
 * - `firstName`: The first name of the user.
 * - `lastName`: The last name of the user.
 * - `biography`: The user's short biography.
 * - `comments`: All of the comments provided by the user.
 * - `answers`: All of the answers provided by the user.
 * - `questions`: All of the questions provided by the user.
 * - `friends`: All of the user's friends.
 * - `requests`: All of the user's friend requests.
 * - `privacySettings`: The user's privacy settings.
 * - `notifications`: All of the user's notifications.
 */
const userSchema: Schema = new Schema(
  {
    picture: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    biography: {
      type: String,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    friends: [{ type: String }],
    requests: [{ type: String }],
    privacySettings: {
      username: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      firstName: { type: Boolean, default: true },
      lastName: { type: Boolean, default: true },
      biography: { type: Boolean, default: true },
      leaderboard: { type: Boolean, default: true },
    },
    notifications: [{ type: Schema.Types.ObjectId, ref: 'UserNotification' }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
    settings: {
      colorMode: { type: String },
      fontSize: { type: String },
      isBlackAndWhite: { type: Boolean },
    },
  },
  { collection: 'User' },
);

export default userSchema;
