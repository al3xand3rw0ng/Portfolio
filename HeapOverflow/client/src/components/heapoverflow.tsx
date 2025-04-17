import { useState, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import './index.css';
import Layout from './layout';
import Login from './login';
import Signup from './signup';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import ProfilePage from './main/profilePage';
import SettingsPage from './main/settingsPage';
import NewProfilePage from './main/makeProfile';
import SocialPage from './main/socialPage';
import ChatPage from './main/socialPage/chatPage';
import EditProfilePage from './main/profilePage/editProfilePage';
import { getUser } from '../services/userService';
import ForgotPassword from './forgotPassword';
import NotificationsPage from './main/notificationsPage';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <Flex
        position='fixed'
        top='0'
        left='0'
        width='100%'
        height='100%'
        justifyContent='center'
        alignItems='center'
        zIndex='1000'>
        <Box textAlign='center'>
          <Text mt={4} fontSize='xl' fontWeight='bold' color='#3090e2'>
            Loading...
          </Text>
        </Box>
      </Flex>
    );
  }

  if (!user || !socket) {
    return <Navigate to='/' />;
  }
  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const HeapOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        setUser({
          picture: '',
          username: currentUser.email || '',
          firstName: 'Unknown',
          lastName: 'Unknown',
          biography: '',
          comments: [],
          answers: [],
          questions: [],
          friends: [],
          requests: [],
          notifications: [],
          chats: [],
          settings: {
            colorMode: 'light',
            fontSize: 'md',
            isBlackAndWhite: false,
          },
        });

        if (!currentUser.email) {
          setUser(null);
          return;
        }
        try {
          const userProfile = await getUser(currentUser.email);
          setUser({ ...userProfile });
        } catch (error) {
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Routes>
        {/* Public Route */}
        <Route path='/' element={<Login />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profileSetup/:email' element={<NewProfilePage />} />
        {/* Protected Routes */}
        {
          <Route
            element={
              <ProtectedRoute user={user} socket={socket}>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path='/home' element={<QuestionPage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='tags' element={<TagPage />} />
            <Route path='/social/chat' element={<ChatPage />} />
            <Route path='/social' element={<SocialPage />} />
            <Route path='/profile/:username' element={<ProfilePage />} />
            <Route path='/question/:qid' element={<AnswerPage />} />
            <Route path='/new/question' element={<NewQuestionPage />} />
            <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
            <Route path='/edit-profile' element={<EditProfilePage />} />
            <Route path='/notifications' element={<NotificationsPage />} />
          </Route>
        }
      </Routes>
    </LoginContext.Provider>
  );
};

export default HeapOverflow;
