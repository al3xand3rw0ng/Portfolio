import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { getFriends } from '../services/friendshipService';
import { FriendListUpdatePayload } from '../types';

/**
 * Represents the useFriendList hook that provides functionality
 * for the FriendList component.
 *
 * @returns friends - An array of friends
 * @returns setFriends - Function to set the friends array
 */
const useFriendList = () => {
  const { user, socket } = useUserContext();
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      try {
        const response = await getFriends(user.username);
        setFriends(Array.isArray(response.userFriends) ? response.userFriends : []);
      } catch (error) {
        throw new Error('Error fetching friends');
      }
    };
    fetchFriends();

    const handleFriendListUpdate = (update: FriendListUpdatePayload) => {
      if (update.username === user.username) {
        setFriends(update.friends);
      }
    };

    socket.on('friendListUpdate', handleFriendListUpdate);
    return () => {
      socket.off('friendListUpdate', handleFriendListUpdate);
    };
  }, [user, socket]);

  return { friends, setFriends };
};

export default useFriendList;
