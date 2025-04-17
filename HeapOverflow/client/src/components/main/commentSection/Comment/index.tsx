import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { Flex, Text } from '@chakra-ui/react';
import TextToSpeech from '../../../../TextToSpeech';
import { getMetaData } from '../../../../tool';
import { Comment } from '../../../../types';
import useProfilePage from '../../../../hooks/useProfilePage';

/**
 * Interface representing the props for a Comment component.
 *
 * - comment: the Comment object
 * - index: the index of the Comment object
 */
interface CommentProps {
  comment: Comment;
  index: number;
}

/**
 * Comment component renders a given comment
 *
 * @param comment: the Comment object
 * @param index: the index of the Comment object
 */
const CommentView = ({ comment, index }: CommentProps) => {
  const navigate = useNavigate();
  const { currentUser } = useProfilePage(comment.commentBy);

  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <li key={index} className='comment-item'>
      <p className={`comment-text`}>{comment.text}</p>
      <small className={`comment-meta}`}>
        <Flex>
          <Flex cursor='pointer' onClick={() => handleProfile(comment.commentBy)}>
            {currentUser?.picture ? (
              <img
                src={currentUser?.picture || '/default-profile.png'}
                alt={`${currentUser?.username || 'User'}'s Profile Picture`}
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '2px',
                }}
              />
            ) : (
              <CgProfile
                color='#3090e2'
                style={{ marginRight: '2px', width: '15px', height: '15px' }}
              />
            )}{' '}
            <Text color='red'>{comment.commentBy}</Text>
          </Flex>
          , {getMetaData(new Date(comment.commentDateTime))}
        </Flex>
      </small>
      <TextToSpeech text={comment.text} />
    </li>
  );
};

export default CommentView;
