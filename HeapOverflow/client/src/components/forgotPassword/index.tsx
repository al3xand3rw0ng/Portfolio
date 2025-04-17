import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Heading, Input, InputGroup } from '@chakra-ui/react';
import './index.css';
import useLogin from '../../hooks/useLogin';

/**
 * ForgotPassword component that renders a form for the user to reset their password.
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>(
    'Please enter your email address to reset password',
  );
  const { passwordReset } = useLogin();
  const [resetEmail, setResetEmail] = useState<string>('');

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setMessage('Please enter your email address to reset password');
      return;
    }
    try {
      await passwordReset(resetEmail);
      setMessage('A password reset email has been sent');
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      setMessage('Failed to send password reset email. Please try again');
    }
  };

  return (
    <div className='container'>
      <Heading>Forgot Password</Heading>
      <Card>
        <CardBody
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          textAlign='center'>
          <h4>{message}</h4>
          <InputGroup size='md' width='100%' mb={3}>
            <Input
              name='resetEmail'
              type='email'
              placeholder='Enter your email for password reset'
              onChange={e => setResetEmail(e.target.value)}
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor='#dddddd'
              variant='filled'
            />
          </InputGroup>
          <Button
            background='#3090e2'
            color='#ffffff'
            fontSize='20px'
            padding='10px'
            _hover={{ background: '#0056b3' }}
            onClick={handlePasswordReset}>
            Reset Password
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ForgotPassword;
