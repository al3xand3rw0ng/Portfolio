import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tr, Th, Td, Text, Box, IconButton, Button, Portal, Flex } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { CgProfile } from 'react-icons/cg';
import useDeleteFriend from '../../../../../hooks/useDeleteFriend';
import { User } from '../../../../../types';
import { getAllUsers } from '../../../../../services/userService';

/**
 * Component that displays the user's friends list.
 */
const FriendsList = () => {
  const { friends, showConfirm, selectedFriend, handleDeleteClick, confirmDelete, cancelDelete } =
    useDeleteFriend();
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
      try {
        const usersData = await getAllUsers();
        const friendsList = usersData.filter(user => friends.includes(user.username));
        setUsers(friendsList);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [friends]);

  return (
    <>
      <Box mb={4}>
        {friends.length === 0 ? (
          <Text as='span' color='gray.500' fontSize='md' textAlign='center' mt={4}>
            No friends right now!
          </Text>
        ) : (
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
                  Friends
                </Th>
              </Tr>
            </thead>
            <tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={1} textAlign='center'>
                    Loading...
                  </Td>
                </Tr>
              ) : (
                users.map((friend, idx) => (
                  <Tr key={idx} bgColor={idx % 2 === 0 ? '#ffffff' : '#dddddd'}>
                    <Td border='1px' borderColor='#dddddd' paddingX={2} paddingY={1}>
                      <Box display='flex' alignItems='center' justifyContent='space-between'>
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
                        <IconButton
                          aria-label={`Delete ${friend}`}
                          icon={<DeleteIcon />}
                          size='xs'
                          colorScheme='red'
                          onClick={() => handleDeleteClick(friend.username)}
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Box>

      {showConfirm && (
        <Portal>
          <Box
            position='fixed'
            top='0'
            left='0'
            width='100%'
            height='100%'
            bg='rgba(0, 0, 0, 0.5)'
            zIndex='1000'
          />
          <Box
            position='fixed'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
            p={4}
            bg='white'
            borderRadius='md'
            boxShadow='lg'
            zIndex='1000'>
            <Text mb={4}>Are you sure you want to delete this friend: {selectedFriend}?</Text>
            <Flex justify-content='space-between'>
              <Button colorScheme='red' mr={2} onClick={confirmDelete}>
                Yes
              </Button>
              <Button onClick={cancelDelete}>No</Button>
            </Flex>
          </Box>
        </Portal>
      )}

      {showConfirm && (
        <Box
          position='fixed'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          p={4}
          bg='white'
          borderRadius='md'
          boxShadow='lg'
          zIndex='1000'>
          <Text mb={4}>Are you sure you want to delete this friend: {selectedFriend}?</Text>
          <Button colorScheme='red' mr={2} onClick={confirmDelete}>
            Yes
          </Button>
          <Button onClick={cancelDelete}>No</Button>
        </Box>
      )}

      {showConfirm && (
        <Box
          position='fixed'
          top='0'
          left='0'
          width='100%'
          height='100%'
          bottom='0'
          bg='rgba(0, 0, 0, 0.5)'
          zIndex='500'
        />
      )}
    </>
  );
};

export default FriendsList;
