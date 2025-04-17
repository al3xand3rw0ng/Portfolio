import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { Button } from '@chakra-ui/react';
import useUserContext from '../../../hooks/useUserContext';
import CreateAccountPrompt from '../../createAccountPrompt';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    if (user?.username === 'Guest') {
      setIsPromptOpen(true);
      return;
    }
    navigate('/new/question');
  };

  return (
    <div>
      <Button
        className='askquestionbtn'
        onClick={() => {
          handleNewQuestion();
        }}
        background='#3090e2'
        color='#ffffff'
        fontSize='20px'
        padding='10px'
        _hover={{ background: '#0056b3' }}>
        Ask a Question
      </Button>
      <CreateAccountPrompt isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} />
    </div>
  );
};

export default AskQuestionButton;
