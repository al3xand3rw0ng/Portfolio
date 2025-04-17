import { CgProfile } from 'react-icons/cg';
import { Box, Button, Flex, Heading, Table, Td, Text, Th, Tooltip, Tr } from '@chakra-ui/react';
import { IoChatbox } from 'react-icons/io5';
import { PiMedalBold } from 'react-icons/pi';
import FriendsPage from './friendsPage';
import CreateAccountPrompt from '../../createAccountPrompt';
import useSocialPage from '../../../hooks/useSocialPage';

/**
 * SocialPage component that renders the FriendsPage component and the social dashboard.
 */
const SocialPage = () => {
  const { user, loading, handleChatNavigate, handleProfile, users, isPromptOpen, setIsPromptOpen } =
    useSocialPage();

  return (
    <Flex direction={['column', 'row']} minHeight='100vh' pt='2%' pb='2%' pl='2%' pr='2%' gap={4}>
      {!(user.username === 'Guest') ? <FriendsPage /> : null}

      <Flex direction='column' width={user.username === 'Guest' ? '100%' : ['100%', '70%']} gap={4}>
        <Box flex={2} borderRadius='md' boxShadow='lg' bg='white' overflow='hidden'>
          <Heading color='#3090e2' as='h3' size='md' mb={4} textAlign='center'>
            Social Dashboard
          </Heading>
          <Tooltip
            hasArrow
            label='The leaderboard rankings are based on user contributions, which include the number of questions, answers, and comments submitted'
            aria-label='The leaderboard rankings are based on user contributions, which include the number of questions, answers, and comments submitted'
            backgroundColor={'#dddddd'}
            textColor={'#3090e2'}>
            <Table
              color='black'
              variant='striped'
              size='xs'
              mt={4}
              mb={4}
              borderRadius='md'
              overflow='hidden'
              border='1px'>
              <thead>
                <Tr>
                  <Th color='black' backgroundColor='#dddddd'>
                    Top 10 Leaderboard
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
                  users.map((currentUser, idx) => (
                    <Tr key={idx} bgColor={idx % 2 === 0 ? '#ffffff' : '#dddddd'}>
                      <Td border='1px' borderColor='#dddddd' paddingX={2} paddingY={1}>
                        <Flex align='center' gap={1}>
                          {idx + 1}
                          {idx + 1 === 1 ? 'st.' : 'th.'}{' '}
                          <Flex
                            onClick={() => handleProfile(currentUser.username)}
                            cursor='pointer'>
                            {currentUser.picture ? (
                              <img
                                src={currentUser.picture || '/default-profile.png'}
                                alt={`${currentUser.username || 'User'}'s Profile Picture`}
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
                            <Text color='red'>{currentUser.username}</Text>
                          </Flex>
                          <Flex justifyContent='flex-end' flexGrow={1}>
                            {idx + 1 === 1 && <PiMedalBold color='gold' />}
                            {idx + 1 === 2 && <PiMedalBold color='silver' />}
                            {idx + 1 === 3 && <PiMedalBold color='#cd7f32' />}
                          </Flex>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          </Tooltip>
        </Box>
        <Box
          flex={1}
          p={4}
          borderRadius='md'
          boxShadow='lg'
          bg='white'
          overflow='hidden'
          textAlign='center'>
          <Heading color='#3090e2' as='h3' size='md' mb={4}>
            Chat With Your Community
          </Heading>
          <Flex justify='center'>
            <Button
              background='#3090e2'
              color='#ffffff'
              fontSize='sm'
              padding='6px'
              onClick={handleChatNavigate}
              _hover={{ background: '#0056b3' }}>
              <Flex align='center' gap={1}>
                <IoChatbox />
                Go to Chat
              </Flex>
            </Button>
          </Flex>
          <CreateAccountPrompt isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default SocialPage;
