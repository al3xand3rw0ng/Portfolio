import { useState } from 'react';
import useUserContext from './useUserContext';
import { sendFriendRequest } from '../services/friendshipService';

/**
 * Represents the useFriendRequestSent hook that provides functionality
 * for the FriendRequestSent component.
 *
 * @returns recipientUsername - the username of the recipient of the friend request.
 * @returns setRecipientUsername - function to set the username of the recipient.
 * @returns statusMessage - the status message to display to the user.
 * @returns handleSendRequest - function to send a friend request to the recipient.
 */
const useFriendRequestSent = () => {
  const { user } = useUserContext();
  const [recipientUsername, setRecipientUsername] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  /**
   * Function to send a friend request to the recipient.
   */
  const handleSendRequest = async () => {
    if (!user) {
      setStatusMessage('User not found. Please log in again.');
      return;
    }

    if (recipientUsername === user.username) {
      setStatusMessage('You cannot send a friend request to yourself. Try someone else!');
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    try {
      await sendFriendRequest(user.username, recipientUsername);
      setStatusMessage(`Friend request sent to ${recipientUsername}!`);
      setRecipientUsername('');
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (error) {
      setStatusMessage('Failed to send friend request. Please try again.');
    }
  };

  return { recipientUsername, setRecipientUsername, statusMessage, handleSendRequest };
};

export default useFriendRequestSent;
