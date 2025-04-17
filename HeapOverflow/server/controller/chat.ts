import express, { Request, Response } from 'express';
import { FakeSOSocket } from '../types';
import ChatModel from '../models/chats';
import UserModel from '../models/users';

/**
 * Controller for the chat endpoint.
 * @param socket - The FakeSOSocket object used to manage the WebSocket connection.
 * @returns - An Express router with the chat routes.
 */
const chatController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Creates a chat between two users.
   * @param req - The Request object containing the sender and receiver usernames.
   * @param res - The Response object used to send back the result of the operation.
   * @returns - A Promise that resolves to void.
   */
  const createChat = async (req: Request, res: Response): Promise<void> => {
    const { participants } = req.body;

    if (!participants || participants.length < 2) {
      res.status(400).send({ error: 'At least two participants are required.' });
      return;
    }

    try {
      const requestingUser = participants[0];
      const otherParticipants = participants.slice(1);

      const user = await UserModel.findOne({ username: requestingUser });

      if (!user) {
        res.status(400).send({ error: 'User not found.' });
        return;
      }

      const notFriends = otherParticipants.filter(
        (participant: string) => !user.friends.includes(participant),
      );

      if (notFriends.length > 0) {
        res.status(400).send({ error: 'You can only create chats with friends.' });
        return;
      }

      const existingChat = await ChatModel.findOne({
        participants: { $all: participants, $size: participants.length },
      });

      if (existingChat) {
        res.status(200).send(existingChat);
        return;
      }

      const newChat = new ChatModel({
        participants,
        createdAt: new Date(),
      });
      await newChat.save();

      await Promise.all(
        participants.map((participant: string) =>
          UserModel.findOneAndUpdate({ username: participant }, { $push: { chats: newChat._id } }),
        ),
      );

      participants.forEach((participant: string) => {
        socket.emit('chatUpdate', newChat);
      });

      res.status(200).send(newChat);
    } catch (error) {
      res.status(500).send({ error: `Error when creating chat: ${error}` });
    }
  };

  /**
   * Retrieves all chats for a user.
   * @param req - The Request object containing the username.
   * @param res - The Response object used to send back the result of the operation.
   */
  const getUserChats = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
    if (!username) {
      res.status(400).send('Username is required.');
      return;
    }
    try {
      const chats = await ChatModel.find({ participants: { $in: [username] } });
      res.status(200).json({ chats });
    } catch (error) {
      res.status(500).send('Error when retrieving chats');
    }
  };

  const getChat = async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.query;
    if (!chatId) {
      res.status(400).send('Chat ID is required.');
      return;
    }
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        res.status(400).send('Chat not found.');
        return;
      }
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).send('Error when retrieving chat');
    }
  };

  router.post('/createChat', createChat);
  router.get('/getUserChats', getUserChats);
  router.get('/getChat', getChat);

  return router;
};

export default chatController;
