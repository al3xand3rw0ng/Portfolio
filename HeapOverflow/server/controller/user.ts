import express, { Request, Response } from 'express';
import UserModel from '../models/users';
import { FakeSOSocket, UserRequest } from '../types';
import { saveUser } from '../models/application';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Add a new User to the database. The user is validated and then saved.
   * If successful, the user is added to the database.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The User object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUser = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const userFromDb = await saveUser(req.body);

      if ('error' in userFromDb) {
        throw new Error(userFromDb.error as string);
      }

      res.json(userFromDb);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  /**
   * Updates user information in the database. The user is validated and then saved.
   *
   * @param req The UserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   */

  const updateUser = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const username = req.params.username as string;
      const updateData = req.body;

      const updatedUser = await UserModel.findOneAndUpdate({ username }, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        throw new Error('User not found');
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).send({ error: `Error when updating user: ${error}` });
    }
  };

  /**
   * Retrieves a user by their username from the database.
   *
   * @param req Request object containing the username of the user
   * @param res Response object containing the user
   */

  const getUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
    try {
      if (!username) {
        res.status(400).send({ error: 'User not found.' });
        return;
      }
      const user = await UserModel.findOne({ username });
      res.json(user);
    } catch (error) {
      res.status(500).send({ error: `Error when finding user` });
    }
  };

  /**
   * Retrieves all users from the database.
   *
   * @param req The request object.
   * @param res The response object containing the list of users.
   */
  const getAllUsers = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (error) {
      res.status(500).send({ error: 'Error when retrieving users' });
    }
  };

  router.post('/addUser', addUser);
  router.put('/updateUser/:username', updateUser);
  router.get('/getUser', getUser);
  router.get('/getAllUsers', getAllUsers);
  return router;
};

export default userController;
