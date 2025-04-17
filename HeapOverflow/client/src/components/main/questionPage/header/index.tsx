import React from 'react';
import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import './index.css';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => (
  <Box pt={'2%'} pb={'2%'} pl={'2%'} pr={'2%'}>
    <Table variant='unstyled' width='100%'>
      <Tbody>
        <Tr>
          <Td padding='0' className='bold_title'>
            {titleText}
          </Td>
          <Td textAlign='right' padding='0'>
            <AskQuestionButton />
          </Td>
        </Tr>
        <Tr height='44px'></Tr>
        <Tr>
          <Td padding='0' className='questionCount'>
            {qcnt} questions
          </Td>
          <Td textAlign='right' padding='0' style={{ position: 'relative' }}>
            <Menu closeOnSelect={true}>
              <MenuButton
                as={Button}
                background='#3090e2'
                color='#ffffff'
                fontSize='20px'
                _hover={{ background: '#0056b3' }}
                _active={{ backgroundColor: '#0056b3' }}>
                Filter Questions
              </MenuButton>
              <MenuList>
                {Object.keys(orderTypeDisplayName).map((order, idx) => (
                  <MenuItem key={idx} onClick={() => setQuestionOrder(order as OrderType)}>
                    {orderTypeDisplayName[order as OrderType]}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  </Box>
);

export default QuestionHeader;
