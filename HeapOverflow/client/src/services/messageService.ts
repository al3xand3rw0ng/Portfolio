import { Message } from '../types';
import api from './config';

const MESSAGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/message`;

/**
 * Sends a message from one user to another.
 *
 * @param sender - The ID of the user sending the message
 * @param chatId - The ID of the chat to which the message is being sent
 * @param message - The message being sent
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const sendMessage = async (sender: string, chatId: string, message: string): Promise<void> => {
  try {
    const res = await api.post(`${MESSAGE_API_URL}/sendMessage`, {
      sender,
      chatId,
      message,
    });
    if (res.status !== 200) {
      throw new Error('Error when sending message');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when sending message');
  }
};

/**
 * Retrieves all messages for a given chat.
 *
 * @param chatId - The ID of the chat
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getMessages = async (chatId: string): Promise<{ messages: Message[] }> => {
  try {
    const res = await api.get(`${MESSAGE_API_URL}/getMessages?chatId=${chatId}`);
    if (res.status !== 200) {
      throw new Error('Error when retrieving messages');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when retrieving messages');
  }
};

export { sendMessage, getMessages };
