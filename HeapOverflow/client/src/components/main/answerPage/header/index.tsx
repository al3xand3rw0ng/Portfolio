import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import './index.css';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
  largeText?: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ ansCount, title, largeText }: AnswerHeaderProps) => (
  <Flex
    direction='row'
    justify='space-between'
    align='center'
    w='100%'
    pt={'2%'}
    pb={'2%'}
    pl={'2%'}
    pr={'2%'}
    gap={4}
    className={`right_padding ${largeText || ''}`}>
    <Box className={`bold_title ${largeText || ''}`}>{ansCount} answers</Box>
    <Box className={`bold_title answer_question_title ${largeText || ''}`}>{title}</Box>
    <AskQuestionButton />
  </Flex>
);

export default AnswerHeader;
