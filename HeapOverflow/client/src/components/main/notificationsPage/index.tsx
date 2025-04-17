import { Box, Button, Flex, Heading, Link, VStack, Text } from '@chakra-ui/react';
import useNotificationPage from '../../../hooks/useNotificationPage';

/**
 * Represents the Notifications page. Displays a list of notifications
 * and provides functionality to mark notifications as read and navigate to the
 * relevant page.
 */
const NotificationsPage = () => {
  const { notifications, handleMarkAsRead, handleNotificationClick } = useNotificationPage();

  return (
    <Box p={4}>
      <Heading mb={4} size='lg' color='blue.500'>
        Notifications
      </Heading>
      {notifications.length > 0 ? (
        <VStack spacing={4} align='stretch'>
          {notifications.map(notification => (
            <Box
              key={notification._id}
              p={4}
              border='1px solid'
              borderColor={notification.isRead ? 'gray.300' : 'blue.500'}
              borderRadius='md'
              bg={notification.isRead ? 'gray.50' : 'blue.50'}>
              <Flex justify='space-between' align='center'>
                <Link onClick={() => handleNotificationClick(notification)}>
                  <Text
                    fontSize='md'
                    fontWeight={notification.isRead ? 'normal' : 'bold'}
                    _hover={{ textDecoration: 'underline' }}>
                    {notification.content}
                  </Text>
                </Link>
                <Button
                  size='sm'
                  colorScheme='blue'
                  variant='outline'
                  onClick={() => handleMarkAsRead(notification._id!)}>
                  {notification.isRead ? 'Read' : 'Mark as Read'}
                </Button>
              </Flex>
              <Text fontSize='xs' color='gray.500' mt={2}>
                {notification.createdAt.toLocaleString()}
              </Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box display='flex' alignItems='center' justifyContent='center' minHeight='60vh'>
          <Text fontSize='lg' color='gray.500' textAlign='center'>
            No notifications right now!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default NotificationsPage;
