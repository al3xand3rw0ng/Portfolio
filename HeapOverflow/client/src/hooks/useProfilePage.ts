import { useState, useEffect } from 'react';
import { User, Answer } from '../types';
import { getUser } from '../services/userService';
import { getAnswer } from '../services/answerService';

/**
 * Represents the useProfilePage hook that provides functionality for the ProfilePage component.
 *
 * @param username - The username of the user whose profile is being viewed
 * @returns currentUser - The user whose profile is being viewed
 * @returns ansList - The list of answers submitted by the user
 */
const useProfilePage = (username: string) => {
  const [ansList, setAnsList] = useState<Answer[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, answers] = await Promise.all([getUser(username), getAnswer(username)]);
        setCurrentUser({ ...user });
        setAnsList(answers);
      } catch (error) {
        throw new Error('Failed to fetch user data');
      }
    };

    fetchData();
  }, [username]);

  return { currentUser, ansList };
};

export default useProfilePage;
