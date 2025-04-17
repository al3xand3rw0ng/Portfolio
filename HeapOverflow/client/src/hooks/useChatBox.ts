import { useState, useRef, useEffect } from 'react';
import { getMessages, sendMessage } from '../services/messageService';
import { Message } from '../types';
import useUserContext from './useUserContext';

/**
 * Represents the useChatBox hook that provides functionality for the ChatBox component.
 *
 * @param chatId - The ID of the chat
 * @param friendUser - The username of the friend
 * @returns currentUser - The username of the current user
 * @returns messages - An array of messages
 * @returns input - The input message
 * @returns setInput - Function to set the input message
 * @returns chatContainerRef - A reference to the chat container
 * @returns loading - A boolean indicating if the data is loading
 * @returns statusMessage - A message indicating the status of the operation
 * @returns handleSendMessage - Function to handle sending a message
 * @returns handleKeyDown - Function to handle the key down event
 */
const useChatBox = ({ chatId, friendUser }: { chatId: string; friendUser: string }) => {
  const { user, socket } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { messages: fetchedMessages } = await getMessages(chatId);
        setMessages(fetchedMessages);
        setLoading(false);
      } catch (error) {
        setStatusMessage('Failed to load messages. Please try again later.');
        setLoading(false);
      }
    };

    fetchMessages();

    /**
     * Function to handle the message update event.
     * @param newMessage - The new message
     */
    const handleMessageUpdate = (newMessage: Message) => {
      if (newMessage.chatId === chatId) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    };

    socket.on('messageUpdate', handleMessageUpdate);
    return () => {
      socket.off('messageUpdate', handleMessageUpdate);
    };
  }, [chatId, socket]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Function to handle sending a message.
   */
  const handleSendMessage = async () => {
    if (input.trim() === '') {
      setStatusMessage('Message cannot be empty.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    try {
      await sendMessage(user.username, chatId, input);
      setInput('');
    } catch (error) {
      setStatusMessage('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to handle the key down event.
   * @param e - the event object.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const currentUser = user.username;

  return {
    currentUser,
    messages,
    input,
    setInput,
    chatContainerRef,
    loading,
    statusMessage,
    handleSendMessage,
    handleKeyDown,
  };
};

export default useChatBox;
