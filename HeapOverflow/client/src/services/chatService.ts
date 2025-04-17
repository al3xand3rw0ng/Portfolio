import { Chat } from '../types';
import api from './config';

const CHAT_API_URL = `${process.env.REACT_APP_SERVER_URL}/chat`;

/**
 * Creates a new chat with the provided participants.
 *
 * @param participants - The participants of the chat
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const createChat = async (participants: string[]): Promise<Chat> => {
  try {
    const res = await api.post(`${CHAT_API_URL}/createChat`, {
      participants,
    });
    if (res.status !== 200) {
      throw new Error('Error when creating chat');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when creating chat');
  }
};

/**
 * Retrieves all chats for a given user.
 *
 * @param username - The username of the user
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getUserChats = async (username: string): Promise<{ chats: Chat[] }> => {
  try {
    const res = await api.get(`${CHAT_API_URL}/getUserChats?username=${username}`);
    if (res.status !== 200) {
      throw new Error('Error when retrieving chats');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when retrieving chats');
  }
};

/**
 * Gets a chat by its id.
 *
 * @param chatId - the id of the chat
 * @returns - The chat with the given id
 */
const getChat = async (chatId: string): Promise<Chat> => {
  try {
    const res = await api.get(`${CHAT_API_URL}/getChat?chatId=${chatId}`);
    if (res.status !== 200) {
      throw new Error('Error when retrieving chat');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when retrieving chat');
  }
};

export { createChat, getUserChats, getChat };
