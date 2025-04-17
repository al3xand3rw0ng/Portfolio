import express, { Router, Request, Response } from 'express';
import { FakeSOSocket } from '../types';
import MessageModel from '../models/messages';
import ChatModel from '../models/chats';

/**
 * Controller for the messages endpoint.
 *
 * @param socket The FakeSOSocket object used to manage the WebSocket connection.
 *
 * @returns An Express router with the message routes.
 */

const messageController = (socket: FakeSOSocket) => {
  const router: Router = express.Router();

  /**
   * Sends a message from one user to another.
   * @param req - The Request object containing the sender, and message.
   * @param res - The Response object used to send back the result of the operation.
   * @returns - A Promise that resolves to void.
   */
  const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { sender, chatId, message } = req.body;

    if (!sender || !chatId || !message) {
      res.status(400).send({ error: 'Invalid message data.' });
      return;
    }

    try {
      const newMessage = new MessageModel({
        sender,
        chatId,
        message,
        createdAt: new Date(),
      });
      await newMessage.save();
      await ChatModel.findByIdAndUpdate(chatId, { $push: { messages: newMessage._id } });
      socket.emit('messageUpdate', newMessage);
      res.status(200).send({ message: 'Message sent.' });
    } catch (error) {
      res.status(500).send({ error: `Error when sending message: ${error}` });
    }
  };

  const getMessages = async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.query;
    if (!chatId) {
      res.status(400).send({ error: 'Invalid chat ID.' });
      return;
    }
    try {
      const messages = await MessageModel.find({ chatId }).sort({ createdAt: 1 });
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).send({ error: `Error when retrieving messages: ${error}` });
    }
  };

  router.post('/sendMessage', sendMessage);
  router.get('/getMessages', getMessages);

  return router;
};

export default messageController;
