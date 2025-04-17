import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import '../index.css';
import useChatBox from '../../../../../hooks/useChatBox';

/**
 * ChatBox component that renders the chat messages and input field.
 * @param - chatId: string, friendUser: string
 */
const ChatBox = ({ chatId, friendUser }: { chatId: string; friendUser: string }) => {
  const {
    currentUser,
    messages,
    input,
    setInput,
    chatContainerRef,
    loading,
    statusMessage,
    handleSendMessage,
    handleKeyDown,
  } = useChatBox({ chatId, friendUser });

  return (
    <Flex height='100%' direction='column'>
      <Box bg='gray.100' p={4} boxShadow='sm'>
        <Heading size='md' color='blue.500'>
          {friendUser.includes(',') ? (
            <>
              Group Chat with{' '}
              {friendUser
                .split(',')
                .map((name, idx, arr) => (idx === arr.length - 1 ? name : `${name}, `))}
            </>
          ) : (
            <>Chat with {friendUser}</>
          )}
        </Heading>
      </Box>

      <Flex
        ref={chatContainerRef}
        flex='1'
        direction='column'
        overflowY='auto'
        bg='gray.50'
        p={4}
        gap={4}
        maxHeight='400px'
        minHeight='400px'>
        {messages.map((msg, idx) => (
          <Box
            key={msg._id || idx}
            alignSelf={msg.sender === currentUser ? 'flex-end' : 'flex-start'}
            bg={msg.sender === currentUser ? 'blue.500' : 'gray.300'}
            color={msg.sender === currentUser ? 'white' : 'black'}
            borderRadius='lg'
            px={4}
            py={2}
            maxWidth='75%'
            boxShadow='sm'
            mb={2}>
            <Box fontWeight='bold'>{msg.sender === currentUser ? 'You' : msg.sender}</Box>
            <Box>{msg.message}</Box>
          </Box>
        ))}
      </Flex>

      <Flex p={4} bg='white' boxShadow='sm'>
        {statusMessage && (
          <Text fontSize='sm' color='red.500' mb={2} textAlign='center'>
            {statusMessage}
          </Text>
        )}
        <Flex>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => handleKeyDown(e)}
            placeholder='Type a message...'
            mr={2}
          />
          <Button colorScheme='blue' onClick={handleSendMessage} isLoading={loading}>
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChatBox;
