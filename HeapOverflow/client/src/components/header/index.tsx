import { useNavigate } from 'react-router-dom';
import { PiTreeStructure } from 'react-icons/pi';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import useHeader from '../../hooks/useHeader';
import './index.css';
import ProfileButton from './profileButton';
import LogoutButton from './logoutButton';
import CreateAccountPrompt from '../createAccountPrompt';
import useUserContext from '../../hooks/useUserContext';
import JoinNowButton from './joinNowButton';
import SignInButton from './signInButton';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleSearchKeyDown, isPromptOpen, setIsPromptOpen } =
    useHeader();
  const { user } = useUserContext();
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "Profile" page.
   * @param username - The name of the user whose profile page to navigate to
   */
  const handleNavigateHome = () => {
    navigate(`/home`);
  };

  return (
    <div id='header' className='header'>
      <div className='title' onClick={() => handleNavigateHome()}>
        <PiTreeStructure style={{ transform: 'rotate(90deg)' }} />
        HeapOverflow
      </div>
      <div className='justify_right'>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <FaSearch color='#909090' />
          </InputLeftElement>
          <Input
            size={'s'}
            placeholder='Search...'
            color='black'
            focusBorderColor='#3090e2'
            backgroundColor={'#dddddd'}
            variant='filled'
            type='text'
            value={val}
            onChange={handleInputChange}
            onKeyDown={handleSearchKeyDown}
            width='auto'
            borderColor={'black'}
            borderWidth={'thin'}
          />
        </InputGroup>
        {!(user.username === 'Guest') ? (
          <>
            <div className='logoutBtn'>
              <LogoutButton />
            </div>
            <div className='profileBtn'>
              <ProfileButton />
            </div>
          </>
        ) : (
          <>
            <div>
              <JoinNowButton />
            </div>
            <div>
              <SignInButton />
            </div>
          </>
        )}
      </div>
      <CreateAccountPrompt isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} />
    </div>
  );
};

export default Header;
