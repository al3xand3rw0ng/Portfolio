import { Button, Card, CardBody, Heading, useColorMode, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import BlackAndWhiteContext from '../../../BlackAndWhiteContext';
import FontContext from '../../../FontContext';
import useUserContext from '../../../hooks/useUserContext';
import CreateAccountPrompt from '../../createAccountPrompt';
import { editUser } from '../../../services/userService';
import useLoginContext from '../../../hooks/useLoginContext';

/**
 * Allows users to edit their settings.
 * @returns SettingsPage - A component that allows users to edit their settings.
 */
const SettingsPage = () => {
  const { user } = useUserContext();
  const { setUser } = useLoginContext();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();
  const font = useContext(FontContext);
  const blackAndWhite = useContext(BlackAndWhiteContext);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!font || !blackAndWhite) {
    throw new Error('Font Context cannot be null');
  }

  const { fontSize, handleToggleFont, setFontSize } = font;
  const { isBlackAndWhite, handleToggleBlackAndWhite, setBlackAndWhite } = blackAndWhite;

  /**
   * Handles saving the user's settings.
   */
  const handleSaveSettings = async () => {
    try {
      const newSettings = {
        fontSize,
        isBlackAndWhite,
        colorMode,
      };
      const updatedUser = {
        ...user,
        settings: {
          ...newSettings,
        },
      };

      const response = await editUser(updatedUser);

      setUser(response);
      setSettingsSaved(true);
    } catch (error) {
      throw new Error('Error while saving settings');
    }
  };

  /**
   * Handles the case where the user is a guest. Prompts them to create an account.
   */
  useEffect(() => {
    if (user.username === 'Guest') {
      setIsPromptOpen(true);
    }
  }, [user.username]);

  /**
   * Applies the user's settings.
   */
  useEffect(() => {
    if (
      user.settings &&
      user.settings.isBlackAndWhite !== undefined &&
      isBlackAndWhite === undefined
    ) {
      setBlackAndWhite(user.settings.isBlackAndWhite);
    }
  }, [user.settings, isBlackAndWhite, setBlackAndWhite]);

  /**
   * Applies the user's font size.
   */
  useEffect(() => {
    if (user.settings && user.settings.fontSize && fontSize === undefined) {
      setFontSize(user.settings.fontSize);
    }
  }, [user.settings, fontSize, setFontSize]);

  /**
   * Applies the new settings to the page.
   */
  useEffect(() => {
    if (isBlackAndWhite) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      document.body.style.filter = 'grayscale(100%)';
    } else {
      document.body.style.backgroundColor = 'initial';
      document.body.style.color = 'initial';
      document.body.style.filter = 'initial';
    }
    let fontSizeValue;

    if (fontSize === 'sm') {
      fontSizeValue = '12px';
    } else if (fontSize === 'md') {
      fontSizeValue = '16px';
    } else if (fontSize === 'lg') {
      fontSizeValue = '20px';
    } else {
      fontSizeValue = '24px';
    }

    document.body.style.fontSize = fontSizeValue;
  }, [colorMode, isBlackAndWhite, fontSize]);

  if (isPromptOpen) {
    return (
      <CreateAccountPrompt
        isOpen={isPromptOpen}
        onClose={() => {
          setIsPromptOpen(false);
          navigate('/home');
        }}
      />
    );
  }

  return (
    <div className='settings-container'>
      <Card backgroundColor={'#ffffff'}>
        <CardBody>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Heading
              className='settings-title'
              size={'lg'}
              color='black'
              display='flex'
              alignItems='center'>
              Settings
            </Heading>
          </div>
          <div className='settings-item' style={{ color: 'black' }}>
            Color Mode
            <Button
              onClick={toggleColorMode}
              disabled={isBlackAndWhite}
              width='80%'
              height='40px'
              border='none'
              borderRadius='5px'
              textAlign='center'
              lineHeight='40px'
              fontSize='16px'
              color='#3090e2'
              bgColor='#dddddd'
              _hover={{ background: '#b3b3b3' }}>
              Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
            </Button>
          </div>
          <div className='settings-item'>
            <Button
              onClick={handleToggleBlackAndWhite}
              width='80%'
              height='40px'
              border='none'
              borderRadius='5px'
              textAlign='center'
              lineHeight='40px'
              fontSize='16px'
              color='#3090e2'
              bgColor='#dddddd'
              _hover={{ background: '#b3b3b3' }}>
              Toggle Color
            </Button>
          </div>
          <div className='settings-item' style={{ color: 'black' }}>
            Text Size
            <Button
              onClick={() => {
                handleToggleFont();
              }}
              width='80%'
              height='40px'
              border='none'
              borderRadius='5px'
              textAlign='center'
              lineHeight='40px'
              fontSize='16px'
              color='#3090e2'
              bgColor='#dddddd'
              _hover={{ background: '#b3b3b3' }}>
              Toggle Text Size
            </Button>
          </div>
          <div>
            <Button
              background='#3090e2'
              color='#ffffff'
              fontSize='20px'
              padding='10px'
              mt={'4'}
              _hover={{ background: '#0056b3' }}
              onClick={() => {
                handleSaveSettings();
              }}>
              Save Settings
            </Button>
            {settingsSaved && (
              <Text color='green.500' mt={4}>
                Settings saved successfully!
              </Text>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;
