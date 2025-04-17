import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Adds a new user to the database.
 *
 * @param user - The user object containing the user details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */

const addUser = async (user: User): Promise<User> => {
  const res = await api.post(`${USER_API_URL}/addUser`, user);
  if (res.status !== 200) {
    throw new Error('Error while creating a new user');
  }
  return res.data;
};

/**
 * Retrieves a user by their username from the database.
 *
 * @param username - The username of the user to be fetched.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */

const getUser = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/getUser?username=${username}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching user');
  }
  return res.data;
};

/**
 * Retrieves all users from the database.
 *
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get(`${USER_API_URL}/getAllUsers`);
  if (res.status !== 200) {
    throw new Error('Error while fetching all users');
  }
  return res.data;
};

/**
 * Updates user information in the database.
 *
 * @param user - The user object containing the updated details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const editUser = async (user: User): Promise<User> => {
  const res = await api.put(`${USER_API_URL}/updateUser/${user.username}`, {
    picture: user.picture,
    firstName: user.firstName,
    lastName: user.lastName,
    biography: user.biography,
    privacySettings: user.privacySettings,
    settings: user.settings,
  });
  if (res.status !== 200) {
    throw new Error('Error while updating user');
  }
  return res.data;
};

export { addUser, getUser, getAllUsers, editUser };
