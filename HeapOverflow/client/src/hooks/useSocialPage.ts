import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/userService';
import { User } from '../types';
import { getComment } from '../services/commentService';
import useQuestionPage from './useQuestionPage';
import { getAnswer } from '../services/answerService';
import useUserContext from './useUserContext';

/**
 * Represents the useSocialPage hook that provides functionality
 *
 * @returns users - An array of users with the highest activity
 * @returns user - The current user
 * @returns loading - A boolean indicating if the data is loading
 * @returns currentUser - The current user
 * @returns totalActivity - The total activity of the current user
 * @returns handleProfile - Function to handle navigation to the "Profile" page
 * @returns handleChatNavigate - Function to handle navigation to the "Chat" page
 * @returns isPromptOpen - A boolean indicating if the prompt is open
 * @returns setIsPromptOpen - Function to set the prompt state
 */
const useSocialPage = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [totalActivity, setTotalAcitivity] = useState<number>(0);

  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleChatNavigate = () => {
    if (user.username === 'Guest') {
      setIsPromptOpen(true);
      return;
    }
    navigate('/social/chat');
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { qlist } = useQuestionPage();

  /**
   * Function to fetch the number of questions asked by a user.
   */
  const fetchQuestions = useCallback(
    (username: string) => qlist.filter(q => q.askedBy === username).length,
    [qlist],
  );

  /**
   * Function to fetch the number of answers submitted by a user.
   * @param username - username of the user
   */
  const fetchAnswers = async (username: string) => {
    const alist = await getAnswer(username);
    return alist.length;
  };

  /**
   * Function to fetch the number of comments submitted by a user.
   * @param username - username of the user
   */
  const fetchComments = async (username: string) => {
    const clist = await getComment(username);
    return clist.length;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();

        const participants = usersData.filter(userData => userData.privacySettings?.leaderboard);

        const userActivityPromises = participants.map(async leaderboardUser => {
          const questions = fetchQuestions(leaderboardUser.username);
          const answers = await fetchAnswers(leaderboardUser.username);
          const comments = await fetchComments(leaderboardUser.username);

          const activity = questions + answers + comments;

          setCurrentUser(currentUser);
          setTotalAcitivity(activity);
          return {
            ...leaderboardUser,
            activity,
          };
        });
        const usersWithActivity = await Promise.all(userActivityPromises);
        const sortedUsers = usersWithActivity.sort((a, b) => b.activity - a.activity);
        const topUsers = sortedUsers.slice(0, 10);
        setUsers(topUsers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [users, qlist, currentUser, fetchQuestions]);

  return {
    users,
    user,
    loading,
    currentUser,
    totalActivity,
    handleProfile,
    handleChatNavigate,
    isPromptOpen,
    setIsPromptOpen,
  };
};

export default useSocialPage;
