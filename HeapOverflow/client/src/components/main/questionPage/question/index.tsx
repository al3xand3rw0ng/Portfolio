import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';
import useProfilePage from '../../../../hooks/useProfilePage';

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();
  const { currentUser } = useProfilePage(q.askedBy);
  /**
   * Function to handle navigation to the "Profile" page.
   * @param username - The name of the user whose profile page to navigate to
   */
  const handleProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  const upVoteCount = q.upVotes.length;
  const downVoteCount = q.downVotes.length;

  let badgeColor = 'default';
  let tooltipMessage =
    'This question has received a balanced response, with equal upvotes and downvotes, or it may not have been voted on yet.';
  if (q.upVotes.length > q.downVotes.length) {
    badgeColor = 'green';
    tooltipMessage = 'This question is favored by the community with more upvotes than downvotes.';
  } else if (q.upVotes.length < q.downVotes.length) {
    badgeColor = 'red';
    tooltipMessage = 'This question is less favorable, with more downvotes than upvotes.';
  }

  return (
    <Flex
      className='question right_padding'
      direction='row'
      justify='space-between'
      align='flex-start'
      pt={'2%'}
      pb={'2%'}
      pl={'2%'}
      pr={'2%'}
      cursor='pointer'
      onClick={() => q._id && handleAnswer(q._id)}
      gap={4}>
      <Flex direction='column' align='flex-start' gap={2}>
        <Text fontSize='sm'>{q.answers.length || 0} answers</Text>
        <Text fontSize='sm'>{q.views.length} views</Text>
        <Tooltip
          hasArrow
          label={tooltipMessage}
          aria-label={tooltipMessage}
          backgroundColor='#dddddd'
          textColor='#3090e2'>
          {badgeColor === 'default' ? (
            <Badge color='black' backgroundColor='#dddddd'>
              {upVoteCount + downVoteCount} votes
            </Badge>
          ) : (
            <Badge colorScheme={badgeColor}>{upVoteCount + downVoteCount} votes</Badge>
          )}
        </Tooltip>
      </Flex>
      <Flex direction='column' flex='1' pl={4} gap={2}>
        <Text fontWeight='bold' fontSize='lg' className='postTitle' color='#3090e2'>
          {q.title}
        </Text>
        <Flex wrap='wrap' gap={2}>
          {q.tags.map((tag, idx) => (
            <Button
              key={idx}
              size='sm'
              color='black'
              backgroundColor={'#dddddd'}
              _hover={'#dddddd'}
              onClick={e => {
                e.stopPropagation();
                clickTag(tag.name);
              }}>
              {tag.name}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex align='center' gap={2}>
        <Text
          fontSize='sm'
          fontWeight='bold'
          cursor='pointer'
          color='red'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleProfile(q.askedBy);
          }}>
          <Flex align='center' gap={2}>
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
            {q.askedBy}
          </Flex>
        </Text>
        <Text fontSize='sm' color='gray.600'>
          {getMetaData(new Date(q.askDateTime))}
        </Text>
      </Flex>
    </Flex>
  );
};

export default QuestionView;
