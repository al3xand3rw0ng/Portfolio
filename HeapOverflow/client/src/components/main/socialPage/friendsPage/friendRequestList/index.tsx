import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Table, Td, Th, Tr, Text } from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import useFriendRequestAccept from '../../../../../hooks/useFriendRequestAccept';
import { User } from '../../../../../types';
import { getAllUsers } from '../../../../../services/userService';

/**
 * Component that displays the incoming friend requests.
 */
const IncomingFriendRequests = () => {
  const { requests, handleAcceptRequest } = useFriendRequestAccept();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  /**
   * Function to handle navigation to the "Profile" page.
   */
  const handleProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        const requestsList = usersData.filter(user => requests.includes(user.username));
        setUsers(requestsList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [requests]);

  return (
    <Box mb={4}>
      {loading && (
        <Text as='span' color='gray.500' fontSize='md' textAlign='center' mt={4}>
          Loading friend requests...
        </Text>
      )}
      {!loading && requests.length === 0 && (
        <Text as='span' color='gray.500' fontSize='md' align={'center'} textAlign='center' mt={4}>
          No incoming requests right now!
        </Text>
      )}
      {!loading && requests.length > 0 && (
        <Table
          color='black'
          variant='striped'
          size='xs'
          mb={4}
          borderRadius='md'
          overflow='hidden'
          border='1px'>
          <thead>
            <Tr>
              <Th color='black' backgroundColor='#dddddd'>
                Incoming Friend requests
              </Th>
            </Tr>
          </thead>
          <tbody>
            {users.map((friend, idx) => (
              <Tr key={idx} bgColor={idx % 2 === 0 ? '#ffffff' : '#dddddd'}>
                <Td border='1px' borderColor='#dddddd' paddingX={2} paddingY={1}>
                  <Flex justify='space-between' align='center'>
                    <Flex
                      cursor={'pointer'}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleProfile(friend.username);
                      }}>
                      {friend.picture ? (
                        <img
                          src={friend.picture || '/default-profile.png'}
                          alt={`${friend.username || 'User'}'s Profile Picture`}
                          style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '8px',
                          }}
                        />
                      ) : (
                        <CgProfile
                          color='#3090e2'
                          style={{ marginRight: '8px', width: '25px', height: '25px' }}
                        />
                      )}
                      <Text color='red'>{friend.username}</Text>
                    </Flex>
                    <Button
                      size='sm'
                      background='#3090e2'
                      color='white'
                      _hover={{ background: '#0056b3' }}
                      onClick={() => handleAcceptRequest(friend.username)}>
                      Accept
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
};

export default IncomingFriendRequests;
