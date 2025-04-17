import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import useFriendRequestSent from '../../../../../hooks/useFriendRequestSent';

/**
 * FriendRequestSender component that renders an input field for the user to enter a username
 */
const FriendRequestSender = () => {
  const { recipientUsername, setRecipientUsername, statusMessage, handleSendRequest } =
    useFriendRequestSent();

  return (
    <VStack spacing={4} width='100%' maxW='400px'>
      <Box display='flex' alignItems='center' gap={4} width='100%'>
        <Input
          value={recipientUsername}
          onChange={e => setRecipientUsername(e.target.value)}
          placeholder='Enter username'
          size='md'
          flex='1'
        />
        <Button
          onClick={handleSendRequest}
          background='#3090e2'
          color='#ffffff'
          fontSize='20px'
          padding='10px'
          _hover={{ background: '#0056b3' }}>
          Send
        </Button>
      </Box>
      {statusMessage && (
        <Text fontSize='md' color='#3090e2'>
          {statusMessage}
        </Text>
      )}
    </VStack>
  );
};

export default FriendRequestSender;
