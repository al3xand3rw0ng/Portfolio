import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import useUserContext from '../../../hooks/useUserContext';

/**
 * JoinNowButton component that renders a button for navigating to the
 * "Sign Up" page. When clicked, it redirects the user to the page
 * where they can view their proile.
 */
const JoinNowButton = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  /**
   * Function to handle navigation to the "Sign Up" page.
   */
  const handleSignUp = () => {
    if (user?.username === 'Guest') {
      navigate(`/signup`);
    }
  };

  return (
    <div>
      <Button
        variant={'outline'}
        background='#ffffff'
        borderColor={'#3090e2'}
        color='#3090e2'
        fontSize='20px'
        padding='10px'
        _hover={{ background: '#3090e2', color: '#ffffff' }}
        onClick={() => {
          handleSignUp();
        }}>
        Join Now
      </Button>
    </div>
  );
};

export default JoinNowButton;
