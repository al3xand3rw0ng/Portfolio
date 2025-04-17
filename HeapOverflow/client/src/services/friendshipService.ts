import api from './config';

const FRIENDSHIP_API_URL = `${process.env.REACT_APP_SERVER_URL}/friendship`;

/**
 * Sends a friend request from one user to another.
 *
 * @param requesterId - The ID of the user sending the friend request
 * @param recipientId - The ID of the user receiving the friend request
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const sendFriendRequest = async (requesterId: string, recipientId: string): Promise<void> => {
  try {
    const res = await api.post(`${FRIENDSHIP_API_URL}/sendFriendRequest`, {
      requesterId,
      recipientId,
    });
    if (res.status !== 200) {
      throw new Error('Error when sending friend request');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when sending friend request');
  }
};

/**
 * Accepts a friend request from one user to another.
 *
 * @param requester - The user who sent the friend request
 * @param recipient - The user who received the friend request
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const acceptFriendRequest = async (requester: string, recipient: string): Promise<void> => {
  try {
    const res = await api.post(`${FRIENDSHIP_API_URL}/acceptFriendRequest`, {
      requester,
      recipient,
    });
    if (res.status !== 200) {
      throw new Error('Error when accepting friend request');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when accepting friend request');
  }
};

/**
 * Retrieves the friends of a given user.
 *
 * @param userId - The ID of the user whose friends are being retrieved
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getFriends = async (userId: string): Promise<{ userFriends: string[] }> => {
  try {
    const res = await api.get(`${FRIENDSHIP_API_URL}/getFriends?userId=${userId}`);
    if (res.status !== 200) {
      throw new Error('Error when retrieving friends');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when retrieving friends');
  }
};

/**
 * Retrieves the friend requests of a given user.
 *
 * @param userId - The ID of the user whose requests are being retrieved
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getRequests = async (userId: string): Promise<{ userRequests: string[] }> => {
  try {
    const res = await api.get(`${FRIENDSHIP_API_URL}/getRequests?userId=${userId}`);
    if (res.status !== 200) {
      throw new Error('Error when retrieving requests');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when retrieving requests');
  }
};

/**
 * Deletes a friend from the current user's friend list.
 *
 * @param currentUsername - the username of the current user
 * @param friendUsername - the username of the friend to be deleted
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const deleteFriend = async (currentUsername: string, friendUsername: string): Promise<void> => {
  try {
    const res = await api.post(`${FRIENDSHIP_API_URL}/deleteFriend`, {
      currentUsername,
      friendUsername,
    });
    if (res.status !== 200) {
      throw new Error('Error when deleting friend');
    }
    return res.data;
  } catch (error) {
    throw new Error('Error when deleting friend');
  }
};

export { sendFriendRequest, acceptFriendRequest, getFriends, getRequests, deleteFriend };
