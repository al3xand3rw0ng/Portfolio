import { Schema } from 'mongoose';

/**
 * Chat schema for the MongoDB database.
 *
 * This schema represents the `Chat` collection in the MongoDB database and is used to define the
 * structure of documents in the collection.
 *
 * @type {Schema}
 */
const chatSchema: Schema = new Schema(
  {
    participants: [{ type: String }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'Chat' },
);

export default chatSchema;
