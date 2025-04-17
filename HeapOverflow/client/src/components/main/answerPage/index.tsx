import React from 'react';
import { Button } from '@chakra-ui/react';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import useAnswerPage from '../../../hooks/useAnswerPage';

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <>
      <VoteComponent question={question} />
      <AnswerHeader ansCount={question.answers.length} title={question.title} />
      <QuestionBody question={question} handleNewComment={handleNewComment} />
      {question.answers.map((a, idx) => (
        <AnswerView
          key={idx}
          text={a.text}
          ansBy={a.ansBy}
          meta={getMetaData(new Date(a.ansDateTime))}
          comments={a.comments}
          handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
        />
      ))}
      <Button
        mt={'2%'}
        mb={'2%'}
        ml={'2%'}
        mr={'2%'}
        background='#3090e2'
        color='#ffffff'
        fontSize='20px'
        padding='10px'
        _hover={{ background: '#0056b3' }}
        _active={{ backgroundColor: '#0056b3' }}
        onClick={() => {
          handleNewAnswer();
        }}>
        Answer Question
      </Button>
    </>
  );
};

export default AnswerPage;
