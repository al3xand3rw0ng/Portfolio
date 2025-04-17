import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import './index.css';
import { getMetaData, handleHyperlink } from '../../../../tool';
import useProfilePage from '../../../../hooks/useProfilePage';
import { Comment, Question } from '../../../../types';
import CommentSection from '../../commentSection';
import TextToSpeech from '../../../../TextToSpeech';

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 * - largeText - The content of the question, which may contain hyperlinks, but with a larger font size.
 */
interface QuestionBodyProps {
  question: Question;
  handleNewComment: (
    comment: Comment,
    targetType: 'question' | 'answer',
    targetId: string | undefined,
  ) => Promise<void>;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ question, handleNewComment }: QuestionBodyProps) => {
  const navigate = useNavigate();
  const { currentUser } = useProfilePage(question.askedBy);
  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = () => {
    navigate(`/profile/${question.askedBy}`);
  };

  return (
    <Flex
      direction='column'
      className='questionBody right_padding'
      pt={'2%'}
      pb={'2%'}
      pl={'2%'}
      pr={'2%'}
      gap={4}>
      <Flex justify='space-between' align='flex-start' w='100%' gap={4}>
        <Box textAlign='right' className='bold_title'>
          {question.views.length} views
        </Box>
        <Box flex='1' textAlign='center' className='answer_question_text'>
          {handleHyperlink(question.text)}
        </Box>
        <Flex align='center' gap={4}>
          <Flex direction='column' align='flex-start' className='question_author' gap={2}>
            <Flex direction='column' gap={2}>
              <Flex align='center' gap={2}>
                <Flex align='center' gap={2} cursor='pointer' onClick={() => handleProfile()}>
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
                    {question.askedBy}
                  </Text>
                </Flex>
                <Text fontSize='sm' color='gray.600'>
                  {getMetaData(new Date(question.askDateTime))}
                </Text>
              </Flex>
              <Flex justify='flex-end' w='100%' pt={1}>
                <TextToSpeech text={question.text} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Box>
        <CommentSection
          comments={question.comments}
          handleAddComment={(comment: Comment) =>
            handleNewComment(comment, 'question', question._id)
          }
        />
      </Box>
    </Flex>
  );
};

export default QuestionBody;
