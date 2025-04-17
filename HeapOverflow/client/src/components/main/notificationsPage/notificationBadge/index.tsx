import { Box } from '@chakra-ui/react';
import useUnreadNotifCount from '../../../../hooks/useUnreadNotifCount';

/**
 * Represents the badge that displays the number of unread notifications.
 */
const NotificationsBadge = () => {
  const { unreadCount } = useUnreadNotifCount();

  if (unreadCount === 0) return null;

  return (
    <Box
      position='absolute'
      top='50%'
      right='8px'
      transform='translateY(-50%)'
      bg='red.500'
      color='white'
      fontSize='xs'
      width='20px'
      height='20px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      borderRadius='full'>
      {unreadCount}
    </Box>
  );
};

export default NotificationsBadge;
