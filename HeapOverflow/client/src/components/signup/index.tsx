import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  Button,
  Card,
  CardBody,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { auth } from '../../firebase';
import './index.css';

/**
 * Allows a user to sign up for an account.
 * @returns Signup - A component that allows users to sign up for an account.
 */
const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        navigate(`/profileSetup/${email}`);
      })
      .catch(err => {
        const errorCode = err.code;

        if (errorCode === 'auth/email-already-in-use') {
          setError(
            'This email is already in use with another HeapOverflow account. Enter another email to create an account.',
          );
          setIsOpen(true);
        } else {
          setError('The password must be at least 6.');
          setIsOpen(true);
        }
      });
  };

  return (
    <div className='container'>
      <Heading>Sign Up</Heading>
      <Card>
        <CardBody
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          textAlign='center'>
          <h4>Please enter your email and password to sign up for an account</h4>
          <form onSubmit={onSubmit}>
            <Input
              type='text'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
              className='input-text'
              id={'emailInput'}
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor={'#dddddd'}
              variant='filled'
            />
            <Input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Enter your password'
              required
              className='input-text'
              id={'passwordInput'}
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor={'#dddddd'}
              variant='filled'
            />
            <br />
            <Button
              type='submit'
              background='#3090e2'
              color='#ffffff'
              fontSize='20px'
              padding='10px'
              _hover={{ background: '#0056b3' }}>
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay backdropFilter='blur(10px)' />
        <ModalContent>
          <ModalHeader>Unable to Create Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody color='red'>{error}</ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Signup;
