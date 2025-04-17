import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Button,
} from '@chakra-ui/react';
import useLoginContext from '../../../../hooks/useLoginContext';
import { editUser } from '../../../../services/userService';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * Allows a user to edit their profile.
 * @returns EditProfilePage - A component that allows users to edit their profile.
 */
const EditProfilePage = () => {
  const { user } = useUserContext();
  const { setUser } = useLoginContext();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biography, setBiography] = useState('');
  const [privacySettings, setPrivacySettings] = useState({
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    biography: true,
    leaderboard: true,
  });

  /**
   * Updates the user's information.
   */
  useEffect(() => {
    if (user) {
      setImageUrl(user.picture || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setBiography(user.biography || '');
      setPrivacySettings({
        email: user.privacySettings?.email ?? true,
        username: user.privacySettings?.username ?? true,
        firstName: user.privacySettings?.firstName ?? true,
        lastName: user.privacySettings?.lastName ?? true,
        biography: user.privacySettings?.biography ?? true,
        leaderboard: user.privacySettings?.leaderboard ?? true,
      });
    }
  }, [user]);

  /**
   * Handles the form submission.
   * @param e - The event object.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user) {
        throw new Error('No user found.');
      }

      const updatedUser = {
        picture: imageUrl,
        username: user.username,
        firstName,
        lastName,
        biography,
        comments: user.comments,
        answers: user.answers,
        questions: user.questions,
        friends: user.friends,
        requests: user.requests,
        privacySettings,
        notifications: user.notifications,
        chats: user.chats,
        settings: user.settings,
      };

      await editUser(updatedUser);
      setUser(updatedUser);
      navigate(`/profile/${user.username}`);
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  };

  return (
    <div className='profile-container'>
      <Card backgroundColor={'#ffffff'}>
        <CardBody>
          <Heading size={'lg'} color='#3090e2' mb='20px'>
            Edit Profile
          </Heading>
          <FormControl mb={4}>
            <FormLabel htmlFor='imageUrl'>Username</FormLabel>
            <Stack direction='row' spacing={2}>
              <label>
                <input
                  type='checkbox'
                  checked={privacySettings.username}
                  onChange={e =>
                    setPrivacySettings(prev => ({
                      ...prev,
                      username: e.target.checked,
                    }))
                  }
                />{' '}
                Show Username
              </label>
            </Stack>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor='imageUrl'>Email</FormLabel>
            <Stack direction='row' spacing={2}>
              <label>
                <input
                  type='checkbox'
                  checked={privacySettings.email}
                  onChange={e =>
                    setPrivacySettings(prev => ({
                      ...prev,
                      email: e.target.checked,
                    }))
                  }
                />{' '}
                Show Email
              </label>
            </Stack>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor='firstName'>First Name</FormLabel>
            <Input
              id='firstName'
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder='Enter first name'
            />
            <Stack direction='row' spacing={2} mt={2}>
              <label>
                <input
                  type='checkbox'
                  checked={privacySettings.firstName}
                  onChange={e =>
                    setPrivacySettings(prev => ({
                      ...prev,
                      firstName: e.target.checked,
                    }))
                  }
                />{' '}
                Show First Name
              </label>
            </Stack>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor='lastName'>Last Name</FormLabel>
            <Input
              id='lastName'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder='Enter last name'
            />
            <Stack direction='row' spacing={2} mt={2}>
              <label>
                <input
                  type='checkbox'
                  checked={privacySettings.lastName}
                  onChange={e =>
                    setPrivacySettings(prev => ({
                      ...prev,
                      lastName: e.target.checked,
                    }))
                  }
                />{' '}
                Show Last Name
              </label>
            </Stack>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor='imageUrl'>Image Address of Profile Picture</FormLabel>
            <Input
              id='imageUrl'
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder='Enter image address of profile picture'
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor='biography'>Biography</FormLabel>
            <Textarea
              id='biography'
              value={biography}
              onChange={e => setBiography(e.target.value)}
              placeholder='Tell us about yourself'
              height='100px'
            />
            <Stack direction='row' spacing={2} mt={2}>
              <label>
                <input
                  type='checkbox'
                  checked={privacySettings.biography}
                  onChange={e =>
                    setPrivacySettings(prev => ({
                      ...prev,
                      biography: e.target.checked,
                    }))
                  }
                />{' '}
                Show Biography
              </label>
            </Stack>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor='imageUrl'>Leaderboard</FormLabel>
            <Stack direction='row' spacing={2}>
              <label>
                <input
                  type='checkbox'
                  checked={privacySettings.leaderboard}
                  onChange={e =>
                    setPrivacySettings(prev => ({
                      ...prev,
                      leaderboard: e.target.checked,
                    }))
                  }
                />{' '}
                Participate in the Leaderboard
              </label>
            </Stack>
          </FormControl>
          <Button
            onClick={handleSubmit}
            background='#3090e2'
            color='#ffffff'
            fontSize='20px'
            padding='10px'
            _hover={{ background: '#0056b3' }}>
            Save Changes
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfilePage;
