import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
} from '@chakra-ui/react';
import useUserContext from '../../hooks/useUserContext';

/**
 * CreateAccountPrompt component that renders a modal for the user to sign up or sign in.
 *
 * @param param isOpen: boolean; onClose: () => void
 */
const CreateAccountPrompt = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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

  /**
   * Function to handle navigation to the "Sign In" page.
   */
  const handeleSignIn = () => {
    if (user?.username === 'Guest') {
      navigate('/');
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter='blur(10px)' />
      <ModalContent>
        <ModalHeader>
          Sign Up or Sign In to Continue
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          To unlock this content, please sign up or sign in. Signing up or signing in gives you
          access to exclusive features and a personalized experience.
        </ModalBody>
        <ModalFooter>
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
            Sign Up
          </Button>
          <Button
            marginLeft={4}
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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccountPrompt;
