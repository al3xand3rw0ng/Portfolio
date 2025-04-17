import './index.css';
import { NavLink } from 'react-router-dom';
import { CiSettings } from 'react-icons/ci';
import { LiaBellSolid, LiaQuestionSolid, LiaUserFriendsSolid } from 'react-icons/lia';
import { AiOutlineTag } from 'react-icons/ai';
import { Box } from '@chakra-ui/react';
import NotificationsBadge from '../notificationsPage/notificationBadge';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => (
  <div id='sideBarNav' className='sideBarNav'>
    <NavLink
      to='/settings'
      id='menu_questions'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      <CiSettings />
      <Box as='span' className='menu_label'>
        Settings
      </Box>
    </NavLink>
    <NavLink
      to='/home'
      id='menu_questions'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      <LiaQuestionSolid />
      <Box as='span' className='menu_label'>
        Questions
      </Box>
    </NavLink>
    <NavLink
      to='/tags'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      <AiOutlineTag />
      <Box as='span' className='menu_label'>
        Tags
      </Box>
    </NavLink>
    <NavLink
      to='/notifications'
      id='menu_notifications'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      <Box className='menu_with_badge'>
        <LiaBellSolid />
        <Box as='span' className='menu_label'>
          Notifications
        </Box>
        <NotificationsBadge />
      </Box>
    </NavLink>
    <NavLink
      to='/social'
      id='menu_social'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      <LiaUserFriendsSolid />
      <Box as='span' className='menu_label'>
        Social
      </Box>
    </NavLink>
  </div>
);

export default SideBarNav;
