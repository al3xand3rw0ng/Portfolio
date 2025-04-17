import express, { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { FakeSOSocket } from '../types';
import UserModel from '../models/users';
import { createNotification } from './userNotification';

/**
 * Controller for the friendship endpoint.
 * @param socket The FakeSOSocket object used to manage the WebSocket connection.
 * @returns An Express router with the friendship routes.
 */
const friendshipController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Sends a friend request from one user to another.
   * @param req The request object containing the requester and recipient IDs.
   * @param res The response object used to send back the result of the operation.
   */
  const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
    const { requesterId, recipientId } = req.body;

    if (!requesterId || !recipientId) {
      res.status(400).send({ error: 'Invalid user emails.' });
      return;
    }

    if (requesterId === recipientId) {
      res.status(400).send({ error: 'You cannot send a friend request to yourself.' });
      return;
    }

    try {
      const requester = await UserModel.findOne({ username: requesterId });
      const recipient = await UserModel.findOne({ username: recipientId });

      if (!requester) {
        res.status(400).send({ error: 'Requester not found.' });
        return;
      }

      if (!recipient) {
        res.status(400).send({ error: 'Recipient not found.' });
        return;
      }

      const recipientUser = await UserModel.findById(recipient);
      if (recipientUser?.requests?.includes(requesterId)) {
        res.status(400).json({ error: 'Friend request already exists.' });
        return;
      }

      await UserModel.findByIdAndUpdate(recipient, {
        $push: { requests: requesterId },
      });

      socket.emit('friendRequestUpdate', {
        requester: requesterId,
        recipient: recipientId,
        status: 'pending',
      });
      const content = `You have a new friend request from ${requesterId}.`;
      await createNotification(socket, [recipientId], requesterId, content, 'request');
      res.status(200).json({ message: 'Friend request sent.' });
    } catch (error) {
      res.status(500).send({ error: 'Error creating friend request', details: error });
    }
  };

  /**
   * Accepts a friend request from one user to another.
   * @param req The request object containing the requester and recipient IDs.
   * @param res The response object used to send back the result of the operation.
   */
  const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
    const { requester, recipient } = req.body;

    if (!requester || !recipient) {
      res.status(400).send({ error: 'Requester and recipient are required.' });
      return;
    }

    try {
      const requesterObjectId = isValidObjectId(requester)
        ? requester
        : (await UserModel.findOne({ username: requester }))?.id;

      const recipientObjectId = isValidObjectId(recipient)
        ? recipient
        : (await UserModel.findOne({ username: recipient }))?.id;

      await UserModel.findByIdAndUpdate(requesterObjectId, {
        $push: { friends: recipient },
      });

      await UserModel.findByIdAndUpdate(recipientObjectId, {
        $push: { friends: requester },
        $pull: { requests: requester },
      });

      const updatedRequesterUser = await UserModel.findById(requesterObjectId, 'friends');
      const updatedRecipientUser = await UserModel.findById(recipientObjectId, 'friends');

      if (!updatedRequesterUser || !updatedRecipientUser) {
        res.status(400).send({ error: 'User not found.' });
        return;
      }

      const updatedRequesterFriends = updatedRequesterUser.friends;
      const updatedRecipientFriends = updatedRecipientUser.friends;

      socket.emit('friendRequestUpdate', { requester, recipient, status: 'accepted' });
      socket.emit('friendListUpdate', { username: requester, friends: updatedRequesterFriends });
      socket.emit('friendListUpdate', { username: recipient, friends: updatedRecipientFriends });
      const content = `${recipient} accepted your friend request!`;
      await createNotification(socket, [requester], recipient, content, 'request');
      res.status(200).send({ message: 'Friend request accepted.' });
    } catch (error) {
      res.status(500).send({ error: 'Error accepting friend request', details: error });
    }
  };

  /**
   * Retrieves the friends of a user.
   * @param req The request object containing the user ID.
   * @param res The response object used to send back the result of the operation.
   */
  const getFriends = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).send({ error: 'Invalid user id.' });
      return;
    }

    try {
      const resolvedUser = await UserModel.findOne({ username: userId });
      if (resolvedUser) {
        const userFriends = resolvedUser.friends;
        res.status(200).json({ userFriends });
        socket.emit('friendListUpdate', { username: String(userId), friends: userFriends });
      }
    } catch (error) {
      res.status(500).send({ error: 'Error retrieving friends', details: error });
    }
  };

  /**
   * Retrieves the friend requests of a user.
   * @param req The request object containing the user ID.
   * @param res The response object used to send back the result of the operation.
   */
  const getRequests = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).send({ error: 'Invalid user ID.' });
      return;
    }

    try {
      const resolvedUser = await UserModel.findOne({ username: userId });

      if (resolvedUser) {
        const userRequests = resolvedUser.requests;
        res.status(200).json({ userRequests });
      }
    } catch (error) {
      res.status(500).send({ error: 'Error retrieving requests', details: error });
    }
  };

  /**
   * Deletes a friend from a user's friend list.
   * @param req The request object containing the current user and friend usernames.
   * @param res The response object used to send back the result of the operation.
   */
  const deleteFriend = async (req: Request, res: Response): Promise<void> => {
    const { currentUsername, friendUsername } = req.body;

    if (!currentUsername || !friendUsername) {
      res.status(400).send({ error: 'Both user IDs are required.' });
      return;
    }

    try {
      const currentUser = await UserModel.findOne({ username: currentUsername });

      const friendUser = await UserModel.findOne({ username: friendUsername });

      if (!currentUser || !friendUser) {
        res.status(404).send({ error: 'User not found.' });
        return;
      }

      const updatedCurrentUser = await UserModel.findById(currentUser._id, 'friends');

      const updatedFriendUser = await UserModel.findById(friendUser._id, 'friends');

      if (!updatedCurrentUser || !updatedFriendUser) {
        res.status(400).send({ error: 'User not found.' });
        return;
      }

      await UserModel.findByIdAndUpdate(currentUser._id, {
        $pull: { friends: friendUsername },
      });
      await UserModel.findByIdAndUpdate(friendUser._id, {
        $pull: { friends: currentUsername },
      });

      const currentUserFriends = updatedCurrentUser?.friends;
      const friendUserFriends = updatedFriendUser?.friends;

      socket.emit('friendListUpdate', { username: currentUsername, friends: currentUserFriends });
      socket.emit('friendListUpdate', { username: friendUsername, friends: friendUserFriends });

      res.status(200).send({ message: 'Friend deleted successfully.' });
    } catch (error) {
      res.status(500).send({ error: 'Error deleting friends', details: error });
    }
  };

  router.post('/sendFriendRequest', sendFriendRequest);
  router.post('/acceptFriendRequest', acceptFriendRequest);
  router.get('/getFriends', getFriends);
  router.get('/getRequests', getRequests);
  router.post('/deleteFriend', deleteFriend);

  return router;
};

export default friendshipController;
