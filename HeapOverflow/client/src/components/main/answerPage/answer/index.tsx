import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Comment } from '../../../../types';
import TextToSpeech from '../../../../TextToSpeech';
import useProfilePage from '../../../../hooks/useProfilePage';

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 * - largeText The content of the answer, which may contain hyperlinks, but with a larger font size.
 * - largeText The content of the answer, which may contain hyperlinks, but with a larger font size.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  largeText?: string;
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, largeText, handleAddComment }: AnswerProps) => {
  const navigate = useNavigate();
  const { currentUser } = useProfilePage(ansBy);
  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = () => {
    navigate(`/profile/${ansBy}`);
  };
  return (
    <Flex
      direction='column'
      className={`answer right_padding ${largeText || ''}`}
      pt={'2%'}
      pb={'2%'}
      pl={'2%'}
      pr={'2%'}
      gap={4}>
      <Flex justify='space-between' align='flex-start' w='100%'>
        <Flex
          align='flex-start'
          flex='1'
          id='answerText'
          className='answerText'
          gap={4}
          wrap='wrap'>
          <Box flex='1'>{handleHyperlink(text)}</Box>
        </Flex>
        <Flex direction='column' gap={2}>
          <Flex align='center' gap={2}>
            <Flex
              align={'center'}
              gap={2}
              cursor='pointer'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleProfile();
              }}>
              {currentUser?.picture ? (
                <Image
                  src={currentUser.picture || '/default-profile.png'}
                  alt={`${currentUser?.username || 'User'}'s Profile Picture`}
                  borderRadius='full'
                  boxSize='25px'
                  objectFit='cover'
                />
              ) : (
                <CgProfile color='#3090e2' style={{ width: '25px', height: '25px' }} />
              )}
              <Text fontSize='sm' fontWeight='bold' color='red'>
                {ansBy}
              </Text>
            </Flex>
            <Text fontSize='sm' color='gray.600'>
              {meta}
            </Text>
          </Flex>
          <Flex justify='flex-end' w='100%' pt={1}>
            <TextToSpeech text={text} />
          </Flex>
        </Flex>
      </Flex>
      <CommentSection
        comments={comments}
        handleAddComment={handleAddComment}
        largeText={largeText ? 'large-text' : ''}
      />
    </Flex>
  );
};

export default AnswerView;
