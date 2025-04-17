import { Schema } from 'mongoose';

const messageSchema: Schema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    // receiver: {
    //   type: String,
    //   default: null,
    // },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'Message' },
);

export default messageSchema;
