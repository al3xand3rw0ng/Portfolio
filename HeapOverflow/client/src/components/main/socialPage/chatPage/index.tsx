import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Tr,
  Td,
  Table,
  Text,
  ModalFooter,
  Input,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { IoChatbox } from 'react-icons/io5';
import { CloseIcon } from '@chakra-ui/icons';
import ChatBox from './chatBox';
import useUserContext from '../../../../hooks/useUserContext';
import { createChat, getChat, getUserChats } from '../../../../services/chatService';
import { Chat } from '../../../../types';

/**
 * ChatPage component that renders the chat list and chat box.
 */
const ChatPage = () => {
  const { user, socket } = useUserContext();
  const [chats, setChats] = useState<Chat[]>([]);
  const [friendUsernames, setFriendUsernames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [chatType, setChatType] = useState<'direct' | 'group' | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const { chats: fetchedChats } = await getUserChats(user.username);
        setChats(prevChats => {
          const chatMap = new Map([...prevChats, ...fetchedChats].map(chat => [chat._id, chat]));
          return Array.from(chatMap.values());
        });
        setLoading(false);
      } catch (error) {
        setStatusMessage('Failed to load chats. Please try again later.');
        setLoading(false);
      }
    };
    fetchChats();

    /**
     * Function to handle chat updates.
     * @param newChat - The updated chat object
     */
    const handleChatUpdate = (newChat: Chat) => {
      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === newChat._id);
        if (chatExists) {
          return prevChats.map(chat => (chat._id === newChat._id ? newChat : chat));
        }
        return [...prevChats, newChat];
      });
    };
    socket.on('chatUpdate', handleChatUpdate);

    return () => {
      socket.off('chatUpdate', handleChatUpdate);
    };
  }, [user, socket]);

  /**
   * Function to create a new chat.
   */
  const handleCreateChat = async () => {
    if (!friendUsernames.length) {
      setStatusMessage('Please enter at least one username.');
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    try {
      const participants = [user.username, ...friendUsernames];
      const newChat = await createChat(participants);

      setChats(prevChats => {
        const chatExists = prevChats.some(chat => chat._id === newChat._id);
        if (chatExists) {
          return prevChats.map(chat => (chat._id === newChat._id ? newChat : chat));
        }
        return [...prevChats, newChat];
      });
      setFriendUsernames([]);
      setChatType(null);
      onClose();
    } catch (e) {
      setStatusMessage('Failed to create chat. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Function to handle chat click.
   * @param chat - The chat object
   */
  const handleChatClick = async (chat: Chat) => {
    if (!chat._id) return;

    setLoading(true);

    try {
      const clickedChat = await getChat(chat._id);

      if (!clickedChat.participants || !Array.isArray(clickedChat.participants)) {
        setStatusMessage('Invalid chat data. Please try again later.');
        return;
      }
      setSelectedChatId(chat._id);
      setSelectedChat(clickedChat);
      setLoading(false);
    } catch (error) {
      setStatusMessage('Failed to load chat. Please try again later.');
      setLoading(false);
    }
  };

  /**
   * Function to close the modal.
   */
  const handleModalClose = () => {
    setChatType(null);
    setFriendUsernames([]);
    onClose();
  };

  const handleAddUsername = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !friendUsernames.includes(trimmedValue)) {
      setFriendUsernames([...friendUsernames, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveUsername = (username: string) => {
    setFriendUsernames(prev => prev.filter(name => name !== username));
  };

  /**
   * Function to render the modal content.
   */
  const renderModalContent = () => {
    if (chatType === null) {
      return (
        <>
          <Button colorScheme='blue' width='100%' mb={2} onClick={() => setChatType('direct')}>
            Direct Chat
          </Button>
          <Button colorScheme='blue' width='100%' onClick={() => setChatType('group')}>
            Group Chat
          </Button>
        </>
      );
    }

    const heading = chatType === 'direct' ? 'Create Direct Chat' : 'Create Group Chat';
    return (
      <>
        <Heading size='sm' mb={2}>
          {heading}
        </Heading>
        <Box>
          <Flex gap={2} mb={2} wrap='wrap'>
            {friendUsernames.map((username, index) => (
              <Box
                key={index}
                bg='blue.500'
                color='white'
                borderRadius='md'
                px={3}
                py={1}
                display='flex'
                alignItems='center'
                gap={2}>
                {username}
                <Button
                  size='xs'
                  variant='ghost'
                  colorScheme='red'
                  onClick={() => handleRemoveUsername(username)}>
                  <CloseIcon boxSize='3' />
                </Button>
              </Box>
            ))}
          </Flex>
          <Flex>
            <Input
              placeholder='Type a username and press Enter'
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddUsername();
              }}
            />
            <Button ml={2} onClick={handleAddUsername} colorScheme='blue'>
              Add
            </Button>
          </Flex>
        </Box>
      </>
    );
  };

  /**
   * Function to render the chat component.
   */
  const renderChatComponent = () => {
    if (loading) {
      return (
        <Flex justifyContent='center' alignItems='center' height='100%'>
          <Spinner size='lg' />
        </Flex>
      );
    }
    if (chats.length === 0) {
      return (
        <Flex justifyContent='center' alignItems='center' height='100%'>
          <Heading size='md' color='#5A5A5A' textAlign='center'>
            You have no chats. Click on the &apos;Create New Chat&apos; button to start a chat with
            a friend!
          </Heading>
        </Flex>
      );
    }
    if (selectedChat) {
      return (
        <Box
          width='90%'
          margin='auto'
          padding='4'
          borderWidth='1px'
          borderRadius='lg'
          boxShadow='md'
          bg='white'>
          <ChatBox
            chatId={selectedChat._id || ''}
            friendUser={selectedChat.participants.filter(p => p !== user.username).join(', ')}
          />
        </Box>
      );
    }
    return (
      <Flex justifyContent='center' alignItems='center' height='100%'>
        <Heading size='lg' color='#3090e2' textAlign='center'>
          Select a chat to start messaging
        </Heading>
      </Flex>
    );
  };

  return (
    <Flex pt='2%' pb='2%' pl='2%' pr='2%' height='100vh'>
      <Box
        display='grid'
        gridTemplateColumns='2fr 3fr'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        width='100%'
        height='100%'>
        <Box backgroundColor='#dddddd' p={4} height='100%'>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
            <Heading size='lg' color='#3090e2'>
              <Flex align='center' gap={1}>
                <IoChatbox />
                Chats
              </Flex>
            </Heading>
            <Button
              background='#3090e2'
              color='#ffffff'
              fontSize='sm'
              _hover={{ background: '#0056b3' }}
              onClick={onOpen}>
              Create New Chat
            </Button>
          </Box>

          <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
            <ModalOverlay backdropFilter='blur(10px)' />
            <ModalContent>
              <ModalHeader>{chatType ? 'Create Chat' : 'Select Chat Type'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>{renderModalContent()}</ModalBody>
              {chatType && (
                <ModalFooter>
                  <Button colorScheme='blue' onClick={handleCreateChat}>
                    Create
                  </Button>
                  <Button variant='ghost' onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              )}
            </ModalContent>
          </Modal>

          {statusMessage && (
            <Text
              fontSize='sm'
              color='red.500'
              mb={2}
              textAlign='center'
              bg='white'
              p={2}
              borderRadius='md'>
              {statusMessage}
            </Text>
          )}

          <Table color='black' variant='striped' size='md'>
            <tbody>
              {chats.map(chat => {
                const isSelected = chat._id === selectedChatId;
                const otherParticipants = chat.participants.filter(p => p !== user.username);
                const displayNames =
                  otherParticipants.length > 3
                    ? `${otherParticipants.slice(0, 3).join(', ')}...`
                    : otherParticipants.join(', ');

                return (
                  <Tr
                    key={chat._id}
                    bgColor={isSelected ? '#e6f7ff' : '#ffffff'}
                    style={{
                      border: isSelected ? '2px solid #3090e2' : 'none',
                      borderRadius: isSelected ? '5px' : '0',
                    }}
                    _hover={{ backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                    onClick={() => handleChatClick(chat)}>
                    <Tooltip label={otherParticipants.join(', ')} placement='right'>
                      <Td border='none' textAlign='center'>
                        {displayNames}
                      </Td>
                    </Tooltip>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Box>

        <Box overflowY='auto'>{renderChatComponent()}</Box>
      </Box>
    </Flex>
  );
};

export default ChatPage;
