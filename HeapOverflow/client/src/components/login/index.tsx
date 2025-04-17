import { useState } from 'react';
import {
  Button,
  Box,
  Card,
  CardBody,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Flex,
} from '@chakra-ui/react';
import './index.css';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const {
    handleUsernameChange,
    handlePasswordChange,
    onLogin,
    guestLogin,
    handleSignUp,
    handleForgotPassword,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`container`}>
      <Heading>
        Welcome to <span className='website-title'>HeapOverflow!</span>
      </Heading>
      <Card margin={2}>
        <CardBody
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          textAlign='center'
          width='100%'>
          <h4>Please enter your email and password</h4>
          <InputGroup size='md' width='100%'>
            <Input
              className='input-text'
              name='username'
              type='email'
              required
              placeholder='Enter your email address'
              onChange={handleUsernameChange}
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor='#dddddd'
              variant='filled'
            />
          </InputGroup>
          <InputGroup size='md' width='100%'>
            <Input
              className='input-text'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter password'
              onChange={handlePasswordChange}
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor='#dddddd'
              variant='filled'
            />
            <InputRightElement width='3rem'>
              {showPassword ? (
                <ViewOffIcon
                  color='#3090e2'
                  cursor='pointer'
                  onClick={toggleShowPassword}
                  _hover={{ color: '#0056b3' }}
                />
              ) : (
                <ViewIcon
                  color='#3090e2'
                  cursor='pointer'
                  onClick={toggleShowPassword}
                  _hover={{ color: '#0056b3' }}
                />
              )}
            </InputRightElement>
          </InputGroup>
          <Box width='100%' textAlign='left' mb={2}>
            <Text
              onClick={handleForgotPassword}
              as='span'
              color='#3090e2'
              cursor='pointer'
              _hover={{ color: '#0056b3', textDecoration: 'underline' }}>
              Forgot Password?
            </Text>
          </Box>
          <Button
            width='100%'
            background='#3090e2'
            color='#ffffff'
            fontSize='20px'
            padding='10px'
            _hover={{ background: '#0056b3' }}
            onClick={onLogin}>
            Login
          </Button>
        </CardBody>
      </Card>
      <Heading>
        <Flex alignItems='center' flexWrap='nowrap'>
          <Text as='h4' whiteSpace='nowrap' fontWeight='normal' fontSize='md'>
            New to HeapOverflow?{' '}
            <Text
              onClick={handleSignUp}
              as='span'
              color='#3090e2'
              cursor='pointer'
              _hover={{ color: '#0056b3', textDecoration: 'underline' }}>
              Join Now{' '}
            </Text>
            or{' '}
            <Text
              onClick={guestLogin}
              as='span'
              color='#3090e2'
              cursor='pointer'
              _hover={{ color: '#0056b3', textDecoration: 'underline' }}>
              Continue as Guest
            </Text>
          </Text>
        </Flex>
      </Heading>
    </div>
  );
};

export default Login;
