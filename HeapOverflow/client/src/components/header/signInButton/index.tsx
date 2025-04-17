import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import useUserContext from '../../../hooks/useUserContext';

/**
 * JoinNowButton component that renders a button for navigating to the
 * "Sign Up" page. When clicked, it redirects the user to the page
 * where they can view their proile.
 */
const SignInButton = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  /**
   * Function to handle navigation to the "Sign In" page.
   */
  const handeleSignIn = () => {
    if (user?.username === 'Guest') {
      navigate('/');
    }
  };

  return (
    <div>
      <Button
        background='#3090e2'
        color='#ffffff'
        fontSize='20px'
        padding='10px'
        _hover={{ background: '#0056b3' }}
        onClick={() => {
          handeleSignIn();
        }}>
        Sign In
      </Button>
    </div>
  );
};

export default SignInButton;
