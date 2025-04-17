import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleHyperlink } from '../../../tool';
import './index.css';
import TextToSpeech from '../../../TextToSpeech';

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
interface CommentProps {
  text: string;
  commentBy: string;
  meta: string;
  largeText?: string;
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
const CommentView = ({ text, commentBy, meta, largeText }: CommentProps) => {
  const navigate = useNavigate();
  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = () => {
    navigate(`/profile/${commentBy}`);
  };

  return (
    <div className={`answer right_padding ${largeText || ''}`}>
      <div id='answerText' className='answerText'>
        {handleHyperlink(text)}
      </div>
      <TextToSpeech text={text} />
      <div className='answerAuthor'>
        <div onClick={() => handleProfile()} className='answer_author'>
          {commentBy}
        </div>
        <div className='answer_question_meta'>{meta}</div>
      </div>
    </div>
  );
};

export default CommentView;
