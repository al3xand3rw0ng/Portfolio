import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useColorMode } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import FontContext from '../../../FontContext';
import BlackAndWhiteContext from '../../../BlackAndWhiteContext';

/**
 * LogoutButton component that renders a button for logging out the user.
 */
const LogoutButton = () => {
  const navigate = useNavigate();
  const font = useContext(FontContext);
  const blackAndWhite = useContext(BlackAndWhiteContext);
  const { colorMode, toggleColorMode } = useColorMode();

  if (!font || !blackAndWhite) {
    throw new Error('Font Context cannot be null');
  }

  const { resetFont } = font;
  const { resetBlackAndWhite } = blackAndWhite;

  const handleSignOut = () => {
    resetFont();
    resetBlackAndWhite();
    if (colorMode === 'dark') {
      toggleColorMode(); // Toggles to light if currently dark
    }
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to login after successful sign-out
      })
      .catch(error => {});
  };

  return (
    <Button
      variant={'outline'}
      background='#ffffff'
      borderColor={'#3090e2'}
      color='#3090e2'
      fontSize='20px'
      padding='10px'
      _hover={{ background: '#3090e2', color: '#ffffff' }}
      onClick={handleSignOut}>
      Logout
    </Button>
  );
};

export default LogoutButton;
