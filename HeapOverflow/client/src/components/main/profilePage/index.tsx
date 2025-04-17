import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Table,
  Tr,
  Th,
  Heading,
  Td,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Select,
} from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import './index.css';
import useQuestionPage from '../../../hooks/useQuestionPage';
import { getComment } from '../../../services/commentService';
import { getMetaData } from '../../../tool';
import { Comment } from '../../../types';
import useProfilePage from '../../../hooks/useProfilePage';
import useUserContext from '../../../hooks/useUserContext';

/**
 * Represents the ProfilePage component which displays the user's profile
 * and provides functionality to handle the user editing their profile.
 */
const NewProfilePage = () => {
  const { username } = useParams();
  const { user } = useUserContext();
  const validUsername = username ?? '';
  const { qlist } = useQuestionPage();
  const [contributionFilter, setContributionFilter] = useState<string>('Clear');
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const { currentUser, ansList } = useProfilePage(validUsername);
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest' | 'BestRated'>('Newest');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!username) {
          throw new Error('No username provided.');
        }
        const comments = await getComment(username);
        setCommentList(comments);
      } catch (error) {
        throw new Error('Failed to fetch comments');
      }
    };

    fetchComments();
  }, [username]);

  const handleRowClick = (type: string, id: string | undefined) => {
    if (type === 'question') {
      navigate(`/question/${id}`);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className='profile-container'>
      <Card backgroundColor={'#ffffff'}>
        <CardBody>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Heading size={'lg'} color='#3090e2' display='flex' alignItems='center'>
              {currentUser?.picture ? (
                <img
                  src={currentUser.picture || '/default-profile.png'}
                  alt={`${currentUser.username || 'User'}'s Profile Picture`}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '20px',
                  }}
                />
              ) : (
                <CgProfile style={{ marginRight: '8px', width: '50px', height: '50px' }} />
              )}
              Profile
            </Heading>
            {user.username === currentUser?.username && (
              <Button
                background='#3090e2'
                color='#ffffff'
                fontSize='20px'
                padding='10px'
                _hover={{ background: '#0056b3' }}
                onClick={handleEditProfile}>
                Edit Profile
              </Button>
            )}
          </div>
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                color: 'black',
                display: 'grid',
                gridTemplateColumns: '1.5fr 4fr',
                gap: '15px',
              }}>
              {currentUser?.privacySettings?.username && (
                <>
                  <div>
                    <strong>Username:</strong>
                  </div>
                  <div>{username || 'N/A'}</div>
                </>
              )}
              <>
                {currentUser?.privacySettings?.email && (
                  <>
                    <div>
                      <strong>Email:</strong>
                    </div>
                    <div>{username || 'N/A'}</div>
                  </>
                )}
                {currentUser?.privacySettings?.firstName && (
                  <>
                    <div>
                      <strong>First Name:</strong>
                    </div>
                    <div>{currentUser?.firstName || 'N/A'}</div>
                  </>
                )}
                {currentUser?.privacySettings?.lastName && (
                  <>
                    <div>
                      <strong>Last Name:</strong>
                    </div>
                    <div>{currentUser?.lastName || 'N/A'}</div>
                  </>
                )}
                {currentUser?.privacySettings?.biography && (
                  <>
                    <div>
                      <strong>Biography:</strong>
                    </div>
                    <div>{currentUser?.biography || 'N/A'}</div>
                  </>
                )}
              </>
            </div>
          </div>
          <div style={{ marginTop: '25px' }}>
            <Heading size='md' color='black' mb='4'>
              Get User Contributions
            </Heading>
            <div style={{ color: 'black', marginBottom: '16px' }}>
              <RadioGroup
                colorScheme='blue'
                onChange={setContributionFilter}
                value={contributionFilter}
                defaultValue={'Clear'}
                mb={2}>
                <Stack direction='row' spacing={4}>
                  <Radio value='Questions'>Questions</Radio>
                  <Radio value='Answers'>Answers</Radio>
                  <Radio value='Comments'>Comments</Radio>
                  <Radio value='Clear'>Clear</Radio>
                </Stack>
              </RadioGroup>
              {contributionFilter === 'Questions' && (
                <Select
                  placeholder='Sort Questions'
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as 'Newest' | 'Oldest' | 'BestRated')}
                  size='xs'
                  width='180px'
                  background='#3090e2'
                  color='#000000'
                  fontSize='20px'
                  _hover={{ background: '#0056b3' }}>
                  {/* _selected={{ color: '#ffffff' }}> */}
                  <option value='Newest'>Newest</option>
                  <option value='Oldest'>Oldest</option>
                  <option value='BestRated'>Best Rated</option>
                </Select>
              )}
              {contributionFilter === 'Answers' && (
                <Select
                  placeholder='Sort Answers'
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as 'Newest' | 'Oldest')}
                  size='xs'
                  width='180px'
                  background='#3090e2'
                  color='#000000'
                  fontSize='20px'
                  _hover={{ background: '#0056b3' }}>
                  <option value='Newest'>Newest</option>
                  <option value='Oldest'>Oldest</option>
                </Select>
              )}
              {contributionFilter === 'Comments' && (
                <Select
                  placeholder='Sort Comments'
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as 'Newest' | 'Oldest')}
                  size='xs'
                  width='180px'
                  background='#3090e2'
                  color='#000000'
                  fontSize='20px'
                  _hover={{ background: '#0056b3' }}>
                  <option value='Newest'>Newest</option>
                  <option value='Oldest'>Oldest</option>
                </Select>
              )}
            </div>
            {contributionFilter !== 'Clear' && (
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                }}>
                <Table color='black' variant='striped' size='sm'>
                  <thead>
                    <Tr>
                      {contributionFilter === 'Questions' && <Th>Question</Th>}
                      {contributionFilter === 'Answers' && <Th>Answer</Th>}
                      {contributionFilter === 'Comments' && <Th>Comment</Th>}
                      {contributionFilter === 'Questions' && <Th>Upvotes</Th>}
                      {contributionFilter === 'Questions' && <Th>Downvotes</Th>}
                      <Th>Date</Th>
                    </Tr>
                  </thead>
                  <tbody>
                    {contributionFilter === 'Questions' && (
                      <>
                        {qlist.filter(q => q.askedBy === username).length === 0 ? (
                          <Text marginY='16px' textAlign='center' color='gray.500'>
                            No questions found.
                          </Text>
                        ) : (
                          qlist
                            .filter(q => q.askedBy === username)
                            .sort((a, b) => {
                              if (sortOrder === 'Newest') {
                                return (
                                  new Date(b.askDateTime).getTime() -
                                  new Date(a.askDateTime).getTime()
                                );
                              }
                              if (sortOrder === 'Oldest') {
                                return (
                                  new Date(a.askDateTime).getTime() -
                                  new Date(b.askDateTime).getTime()
                                );
                              }
                              if (sortOrder === 'BestRated') {
                                const scoreA = (a.upVotes.length || 0) - (a.downVotes.length || 0);
                                const scoreB = (b.upVotes.length || 0) - (b.downVotes.length || 0);
                                return scoreB - scoreA; // Highest first
                              }
                              return 0;
                            })
                            .map((q, idx) => (
                              <Tr
                                key={idx}
                                bgColor={idx % 2 === 0 ? '#ffffff' : '#dddddd'}
                                _hover={{ backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                                onClick={() => handleRowClick('question', q._id)}>
                                <Td>{q.title}</Td>
                                <Td>{q.upVotes.length}</Td>
                                <Td>{q.downVotes.length}</Td>
                                <Td>{getMetaData(new Date(q.askDateTime))}</Td>
                              </Tr>
                            ))
                        )}
                      </>
                    )}
                    {contributionFilter === 'Answers' && (
                      <>
                        {ansList.filter(a => a.ansBy === username).length === 0 ? (
                          <Text marginY='16px' textAlign='center' color='gray.500'>
                            No answers found.
                          </Text>
                        ) : (
                          ansList
                            .filter(a => a.ansBy === username)
                            .sort((a, b) => {
                              if (sortOrder === 'Newest') {
                                return (
                                  new Date(b.ansDateTime).getTime() -
                                  new Date(a.ansDateTime).getTime()
                                );
                              }
                              return (
                                new Date(a.ansDateTime).getTime() -
                                new Date(b.ansDateTime).getTime()
                              );
                            })
                            .map((a, idx) => (
                              <Tr key={idx} bgColor={idx % 2 === 0 ? '#ffffff' : '#dddddd'}>
                                <Td>{a.text}</Td>
                                <Td>{getMetaData(new Date(a.ansDateTime))}</Td>
                              </Tr>
                            ))
                        )}
                      </>
                    )}
                    {contributionFilter === 'Comments' && (
                      <>
                        {commentList.filter(c => c.commentBy === username).length === 0 ? (
                          <Text marginY='16px' textAlign='center' color='gray.500'>
                            No comments found.
                          </Text>
                        ) : (
                          commentList
                            .filter(c => c.commentBy === username)
                            .sort((a, b) => {
                              if (sortOrder === 'Newest') {
                                return (
                                  new Date(b.commentDateTime).getTime() -
                                  new Date(a.commentDateTime).getTime()
                                );
                              }
                              return (
                                new Date(a.commentDateTime).getTime() -
                                new Date(b.commentDateTime).getTime()
                              );
                            })
                            .map((c, idx) => (
                              <Tr key={idx} bgColor={idx % 2 === 0 ? '#ffffff' : '#dddddd'}>
                                <Td>{c.text}</Td>
                                <Td>{getMetaData(new Date(c.commentDateTime))}</Td>
                              </Tr>
                            ))
                        )}
                      </>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default NewProfilePage;
