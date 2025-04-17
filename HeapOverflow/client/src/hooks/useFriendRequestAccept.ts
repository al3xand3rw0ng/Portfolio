import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { acceptFriendRequest, getRequests } from '../services/friendshipService';
import { FriendListUpdatePayload, FriendRequestUpdatePayload } from '../types';
import useFriendList from './useFriendList';

/**
 * Represents the useFriendRequestAccept hook that provides functionality
 * for the FriendRequestAccept component.
 *
 * @returns friends - An array of friends
 * @returns requests - An array of friend requests
 * @returns handleAcceptRequest - Function to accept a friend request
 */
const useFriendRequestAccept = () => {
  const { user, socket } = useUserContext();
  const { friends, setFriends } = useFriendList();
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;

      try {
        const response = await getRequests(user.username);
        setRequests(Array.isArray(response.userRequests) ? response.userRequests : []);
      } catch (error) {
        throw new Error('Error fetching friend requests');
      }
    };
    fetchRequests();
  }, [user]);

  useEffect(() => {
    const handleFriendRequestUpdate = (update: FriendRequestUpdatePayload) => {
      const { requester, recipient, status } = update;
      if (status === 'pending' && recipient === user.username) {
        setRequests(prev => [...prev, requester]);
      } else {
        setRequests(prev => prev.filter(req => req !== requester));
      }
    };
    const handleFriendListUpdate = (update: FriendListUpdatePayload) => {
      if (update.username === user.username) {
        setFriends(update.friends);
      }
    };
    socket.on('friendRequestUpdate', handleFriendRequestUpdate);
    socket.on('friendListUpdate', handleFriendListUpdate);
    return () => {
      socket.off('friendRequestUpdate', handleFriendRequestUpdate);
      socket.off('friendListUpdate', handleFriendListUpdate);
    };
  }, [user, socket, setFriends]);

  const handleAcceptRequest = async (requesterUsername: string) => {
    if (!user) return;

    try {
      await acceptFriendRequest(requesterUsername, user.username);
      setRequests(prev => prev.filter(req => req !== requesterUsername));
      setFriends(prev => [...prev, requesterUsername]);
    } catch (error) {
      throw new Error('Error accepting friend request');
    }
  };

  return { friends, requests, handleAcceptRequest };
};

export default useFriendRequestAccept;
