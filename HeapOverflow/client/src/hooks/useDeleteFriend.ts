import { useEffect, useState } from 'react';
import { deleteFriend } from '../services/friendshipService';
import useUserContext from './useUserContext';
import useFriendList from './useFriendList';
import { FriendListUpdatePayload } from '../types';

/**
 * Represents the useDeleteFriend hook that provides functionality
 * for the DeleteFriend component.
 *
 * @returns friends - An array of friends
 * @returns showConfirm - A boolean indicating whether the delete confirmation dialog is visible
 * @returns selectedFriend - The username of the friend to delete
 * @returns handleDeleteClick - Function to handle the delete click event
 * @returns confirmDelete - Function to confirm the friend deletion
 * @returns cancelDelete - Function to cancel the friend deletion
 */
const useDeleteFriend = () => {
  const { user, socket } = useUserContext();
  const { friends, setFriends } = useFriendList();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  useEffect(() => {
    const handleFriendListUpdate = (update: FriendListUpdatePayload) => {
      if (update.username === user.username) {
        setFriends(update.friends);
      }
    };
    socket.on('friendListUpdate', handleFriendListUpdate);
    return () => {
      socket.off('friendListUpdate', handleFriendListUpdate);
    };
  }, [socket, user, setFriends]);

  /**
   * Function to handle the delete click event.
   *
   * @param friend - The username of the friend to delete
   */
  const handleDeleteClick = (friend: string) => {
    setSelectedFriend(friend);
    setShowConfirm(true);
  };

  /**
   * Function to confirm the friend deletion.
   */
  const confirmDelete = async () => {
    if (!selectedFriend) return;

    try {
      await deleteFriend(user.username, selectedFriend);
      setFriends(prevFriends => prevFriends.filter(f => f !== selectedFriend));
      setSelectedFriend(null);
      setShowConfirm(false);
    } catch (error) {
      throw new Error('Error deleting friend');
    }
  };

  /**
   * Function to cancel the friend deletion.
   */
  const cancelDelete = () => {
    setSelectedFriend(null);
    setShowConfirm(false);
  };

  return { friends, showConfirm, selectedFriend, handleDeleteClick, confirmDelete, cancelDelete };
};

export default useDeleteFriend;
