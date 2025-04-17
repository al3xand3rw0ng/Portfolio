import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import useUserContext from '../../../hooks/useUserContext';
import CreateAccountPrompt from '../../createAccountPrompt';

/**
 * ProfileButton component that renders a button for navigating to the
 * "Profile" page. When clicked, it redirects the user to the page
 * where they can view their proile.
 */
const ProfileButton = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = () => {
    if (user?.username === 'Guest') {
      setIsPromptOpen(true);
      return;
    }
    navigate(`/profile/${user.username}`);
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
          handleProfile();
        }}>
        {user.username}
      </Button>
      <CreateAccountPrompt isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} />
    </div>
  );
};

export default ProfileButton;
