import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState, useContext } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
} from 'firebase/auth';
import { useColorMode, useToast } from '@chakra-ui/react';
import { auth } from '../firebase';
import useLoginContext from './useLoginContext';
import { getUser } from '../services/userService';
import BlackAndWhiteContext from '../BlackAndWhiteContext';
import FontContext from '../FontContext';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns handleUsernameChange - function to handle changes in the username input field.
 * @returns handlePasswordChange - function to handle changes in the password input field.
 * @returns onLogin - function to handle the login event.
 * @returns passwordReset - function to handle the password reset event.
 * @returns guestLogin - function to handle the guest login event.
 * @returns handleSignUp - function to handle the sign up event.
 * @returns handleForgotPassword - function to handle the forgot password event.
 * @returns applySettings - function to apply the user's settings.
 */
const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useLoginContext();
  const { toggleColorMode, colorMode } = useColorMode();
  const font = useContext(FontContext);
  const blackAndWhite = useContext(BlackAndWhiteContext);
  const toast = useToast();

  if (!font || !blackAndWhite) {
    throw new Error('Font Context cannot be null');
  }

  const { setBlackAndWhite } = blackAndWhite;
  const { setFontSize } = font;
  const navigate = useNavigate();

  const applySettings = (settings: {
    colorMode: string;
    fontSize: string;
    isBlackAndWhite: boolean;
  }) => {
    if (settings.isBlackAndWhite) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      document.body.style.filter = 'grayscale(100%)';
    } else {
      document.body.style.backgroundColor = 'initial';
      document.body.style.color = 'initial';
      document.body.style.filter = 'initial';
    }

    let fontSize;
    if (settings.fontSize === 'sm') {
      fontSize = '12px';
    } else if (settings.fontSize === 'md') {
      fontSize = '16px';
    } else if (settings.fontSize === 'lg') {
      fontSize = '20px';
    } else {
      fontSize = '24px';
    }
    document.body.style.fontSize = fontSize;

    if (settings.colorMode !== colorMode) {
      toggleColorMode();
    }

    setBlackAndWhite(settings.isBlackAndWhite);
    setFontSize(settings.fontSize);
  };

  /**
   * Function to handle the login event.
   *
   * @param e - the event object.
   */
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);

      try {
        await signInWithEmailAndPassword(auth, username, password);
      } catch (error) {
        throw new Error('Failed to sign in');
      }
      const user = await getUser(username);

      setUser({
        picture: user.picture,
        username,
        firstName: user.firstName,
        lastName: user.lastName,
        biography: user.biography,
        comments: user.comments,
        answers: user.answers,
        questions: user.questions,
        friends: user.friends,
        requests: user.requests,
        notifications: user.notifications,
        chats: user.chats,
        settings: {
          colorMode: user.settings.colorMode,
          fontSize: user.settings.fontSize,
          isBlackAndWhite: user.settings.isBlackAndWhite,
        },
      });

      applySettings(user.settings);

      navigate('/home');
    } catch (error) {
      toast({
        title: 'Login failed.',
        description: 'Incorrect password. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * Function to handle the input change event for username.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgotPassword');
  };

  const passwordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  };

  const guestLogin = async () => {
    await signInAnonymously(auth);
    setUser({
      picture: '',
      username: 'Guest',
      firstName: 'Guest',
      lastName: '',
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
    navigate('/home');
  };

  return {
    handleUsernameChange,
    handlePasswordChange,
    onLogin,
    passwordReset,
    guestLogin,
    handleSignUp,
    handleForgotPassword,
  };
};

export default useLogin;
