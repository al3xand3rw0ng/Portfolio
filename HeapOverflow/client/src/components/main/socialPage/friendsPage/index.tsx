import { Box, Flex, Heading } from '@chakra-ui/react';
import { IoIosPeople } from 'react-icons/io';
import IncomingFriendRequests from './friendRequestList';
import FriendsList from './friendsList';
import FriendRequestSender from './sendFriendRequest';

/**
 * FriendsPage component that renders the FriendsList, FriendRequestSender, and IncomingFriendRequests components.
 */
const FriendsPage = () => (
  <Box width={['100%', '30%']} borderRadius='md' boxShadow='lg' bg='white' overflow='hidden'>
    <Heading color='#3090e2' as='h3' size='md' textAlign='center' mb={4}>
      <Flex align='center' justify='center'>
        <IoIosPeople style={{ marginRight: '6px' }} />
        Friends
      </Flex>
    </Heading>
    <FriendsList />
    <Box mb={4}>
      Send Friend Request
      <FriendRequestSender />
    </Box>
    <IncomingFriendRequests />
  </Box>
);

export default FriendsPage;
