import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Heading, Input, Textarea } from '@chakra-ui/react';
import { addUser } from '../../../services/userService';
import { User } from '../../../types';

/**
 * Allows users to create their profile.
 * @returns ProfileSetup - A component that allows users to create their profile.
 */
const ProfileSetup = () => {
  const navigate = useNavigate();
  const params = useParams<{ email: string }>();
  const email = params.email || '';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biography, setBiography] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const newUser: User = {
    picture: imageUrl,
    username: email,
    firstName,
    lastName,
    biography,
    comments: [],
    answers: [],
    questions: [],
    friends: [],
    requests: [],
    privacySettings: {
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      biography: true,
      leaderboard: true,
    },
    notifications: [],
    chats: [],
    settings: {
      colorMode: 'light',
      fontSize: 'md',
      isBlackAndWhite: false,
    },
  };

  /**
   * Handles the form submission.
   * @param e - The event object.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUser);
    navigate('/');
  };

  return (
    <div className='container'>
      <Heading>Create Your Profile</Heading>
      <Card>
        <CardBody
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          textAlign='center'>
          <form onSubmit={handleSubmit}>
            <h4>
              Please provide your first name, last name, and optionally, the image address for your{' '}
              {<br />} profile picture and a brief biography to share more about yourself with the
              community.
            </h4>
            <Input
              type='text'
              placeholder='First Name'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className='input-text'
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor={'#dddddd'}
              variant='filled'
            />
            <br />
            <Input
              type='text'
              placeholder='Last Name'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className='input-text'
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor={'#dddddd'}
              variant='filled'
            />
            <br />
            <Input
              type='text'
              placeholder='Image Address for Profile Picture'
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className='input-text'
              color='black'
              focusBorderColor='#3090e2'
              backgroundColor={'#dddddd'}
              variant='filled'
            />
            <br />
            <Textarea
              placeholder='Biography'
              value={biography}
              onChange={e => setBiography(e.target.value)}
              color='black'
              className='input-text'
              focusBorderColor='#3090e2'
              backgroundColor={'#dddddd'}
              variant='filled'></Textarea>
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
    </div>
  );
};

export default ProfileSetup;
