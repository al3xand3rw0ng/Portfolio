import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import UserModel from '../models/users';
import UserNotification from '../models/userNotifications';

describe('POST /sendFriendRequest', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const mockUser = {
    picture: 'https://www.google.com',
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    biography: 'This is a test user',
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
  };

  it('should return 400 if friend request already exists', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: 'requesterId', username: 'requester' })
      .mockResolvedValueOnce({ id: 'recipientId', username: 'recipient' });

    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce({
      _id: 'recipientId',
      requests: ['requesterId'],
    });

    const response = await supertest(app).post('/friendship/sendFriendRequest').send({
      requesterId: 'requesterId',
      recipientId: 'recipientId',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Friend request already exists.');
  });

  it('should return an error if requesterId or recipientId are missing', async () => {
    const response = await supertest(app)
      .post('/friendship/sendFriendRequest')
      .send({ requesterId: mockUser.username });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user emails.');
  });

  it('should return an error if requesterId and recipientId are the same', async () => {
    const response = await supertest(app)
      .post('/friendship/sendFriendRequest')
      .send({ requesterId: mockUser.username, recipientId: mockUser.username });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('You cannot send a friend request to yourself.');
  });

  it('should return 400 if recipientId is not found', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: '1234abcd', username: mockUser.username })
      .mockResolvedValueOnce(null);

    const response = await supertest(app)
      .post('/friendship/sendFriendRequest')
      .send({ requesterId: mockUser.username, recipientId: 'nonexistentUser' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Recipient not found.');
  });

  it('should return 400 if requesterId is not found', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: '5678efgh', username: 'validRecipient' });
    const response = await supertest(app)
      .post('/friendship/sendFriendRequest')
      .send({ requesterId: 'nonexistentRequester', recipientId: 'validRecipient' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Requester not found.');
  });

  it('should return 500 if there was an error creating friend request', async () => {
    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce({
      _id: 'recipientId',
      requests: ['requesterId'],
    });

    const response = await supertest(app).post('/friendship/sendFriendRequest').send({
      requesterId: 'requesterId',
      recipientId: 'recipientId',
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error creating friend request');
  });

  it('should successfully send a friend request', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: 'requesterId', username: 'requesterUser' })
      .mockResolvedValueOnce({ id: 'recipientId', username: 'recipientUser' });

    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce({
      _id: 'recipientId',
      requests: [],
    });

    jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValueOnce({});

    jest
      .spyOn(UserNotification, 'insertMany')
      .mockResolvedValueOnce([
        new UserNotification({ _id: 'recipientId', recipient: 'recipientUser' }),
      ]);
    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/friendship/sendFriendRequest').send({
      requesterId: 'requesterUser',
      recipientId: 'recipientUser',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Friend request sent.');
  });
});

describe('POST /acceptFriendRequest', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 400 if requester and recipient are not provided', async () => {
    const response = await supertest(app).post('/friendship/acceptFriendRequest').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Requester and recipient are required.');
  });

  it('should return 500 if there was an error accepting friend request', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: 'requesterId', username: 'requester' });
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: 'recipientId', username: 'recipient' });
    jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValueOnce({});
    const response = await supertest(app).post('/friendship/acceptFriendRequest').send({
      requester: 'requester',
      recipient: 'recipient',
    });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error accepting friend request');
  });

  it('should successfully accept a friend request', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: '673f77ab688a1b22e200e1db', username: 'oliver@gmail.com' })
      .mockResolvedValueOnce({ id: '673f788d688a1b22e200e227', username: 'aiku@gmail.com' });

    jest
      .spyOn(UserModel, 'findById')
      .mockResolvedValueOnce({
        _id: '673f77ab688a1b22e200e1db',
        friends: ['673f7160678bd631ba5d1cdf', '673f694b678bd631ba5d1c14'],
      })
      .mockResolvedValueOnce({
        _id: '673f788d688a1b22e200e227',
        friends: ['67417ef8cd47ef38fa87ebd3'],
        requests: ['673f77ab688a1b22e200e1db'],
      });

    jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValueOnce({}).mockResolvedValueOnce({});

    jest
      .spyOn(UserNotification, 'insertMany')
      .mockResolvedValueOnce([
        new UserNotification({ _id: '673f77ab688a1b22e200e1db', recipient: 'oliver@gmail.com' }),
      ]);
    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/friendship/acceptFriendRequest').send({
      requester: '673f77ab688a1b22e200e1db',
      recipient: '673f788d688a1b22e200e227',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Friend request accepted.');
  });

  it('should return a 500 error if friend update fails', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: 'kuroo@gmail.com', username: 'kuroo@gmail.com' })
      .mockResolvedValueOnce({ id: 'tetsu@gmail.com', username: 'tetsu@gmail.com' });

    jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue({}).mockResolvedValue(null);

    jest
      .spyOn(UserModel, 'findById')
      .mockResolvedValueOnce({
        _id: 'kuroo@gmail.com',
        friends: ['kenma@gmail.com', 'tsukki@gmail.com'],
      })
      .mockResolvedValueOnce(null);

    const response = await supertest(app).post('/friendship/acceptFriendRequest').send({
      requester: 'kuroo@gmail.com',
      recipient: 'tetsu@gmail.com',
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error accepting friend request');
  });

  it('should return a 400 error if requesterUser or recipientUser is not found', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: 'kuroo@gmail.com', username: 'kuroo@gmail.com' })
      .mockResolvedValueOnce({ id: 'tetsu@gmail.com', username: 'tetsu@gmail.com' });

    jest
      .spyOn(UserModel, 'findById')
      .mockResolvedValueOnce({
        _id: 'kuroo@gmail.com',
        friends: ['kenma@gmail.com', 'tsukki@gmail.com'],
      })
      .mockResolvedValueOnce(null);

    jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValueOnce({}).mockResolvedValueOnce({});

    jest
      .spyOn(UserNotification, 'insertMany')
      .mockResolvedValueOnce([
        new UserNotification({ _id: 'tetsu@gmail.com', recipient: 'tetsu@gmail.com' }),
      ]);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/friendship/acceptFriendRequest').send({
      requester: 'kuroo@gmail.com',
      recipient: 'tetsu@gmail.com',
    });

    expect(response.status).toBe(400); // Expect HTTP 400
    expect(response.body.error).toBe('User not found.'); // Expect the correct error message
  });
});

describe('/GET /getFriends', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 400 if user id is invalid', async () => {
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({ friends: [] });
    const response = await supertest(app).get('/friendship/getFriends');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user id.');
  });

  it('should return 500 if there is an error retrieving friends', async () => {
    // Mock UserModel.findOne to throw an error
    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await supertest(app)
      .get('/friendship/getFriends')
      .query({ userId: 'testUser' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Error retrieving friends',
      details: expect.any(Object),
    });
  });

  it('should successfully retrieve ones friends', async () => {
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({
      username: 'testUser',
      friends: ['friend1', 'friend2'],
    });

    const response = await supertest(app)
      .get('/friendship/getFriends')
      .query({ userId: 'testUser' });

    expect(response.status).toBe(200);
    expect(response.body.userFriends).toEqual(['friend1', 'friend2']);
  });
});

describe('/GET /getRequests', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 400 if userId is missing', async () => {
    const response = await supertest(app).get('/friendship/getRequests');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid user ID.');
  });

  it('should return 200 and user requests if the user is found', async () => {
    const mockUser = {
      _id: 'mockUserId',
      username: 'testUser',
      requests: ['request1', 'request2'],
    };

    // Mock UserModel.findOne to simulate a successful user lookup
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser);

    const response = await supertest(app)
      .get('/friendship/getRequests')
      .query({ userId: 'testUser' });

    expect(response.status).toBe(200);
    expect(response.body.userRequests).toEqual(['request1', 'request2']);
  });

  it('should return 500 if an error occurs during request retrieval', async () => {
    jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await supertest(app)
      .get('/friendship/getRequests')
      .query({ userId: 'mockUserId' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error retrieving requests');
  });
});

describe('POST /deleteFriend', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return an error if currentUsername or friendUsername are missing', async () => {
    // Test when currentUsername is missing
    const response1 = await supertest(app)
      .post('/friendship/deleteFriend')
      .send({ friendUsername: 'friendUsername' });

    expect(response1.status).toBe(400);
    expect(response1.body.error).toBe('Both user IDs are required.');

    // Test when friendUsername is missing
    const response2 = await supertest(app)
      .post('/friendship/deleteFriend')
      .send({ currentUsername: 'currentUser' });

    expect(response2.status).toBe(400);
    expect(response2.body.error).toBe('Both user IDs are required.');
  });

  it('should return a 404 error if currentUser is not found', async () => {
    const mockData = {
      currentUsername: 'nonExistentUser',
      friendUsername: 'existingFriend',
    };

    // Spy on UserModel.findOne and mock the return value for currentUser
    const findOneSpy = jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null); // Mock currentUser to not be found
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ username: 'existingFriend', requests: [] }); // Mock friendUser to be found

    const response = await supertest(app).post('/friendship/deleteFriend').send(mockData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found.');

    // Ensure the spy was called
    expect(findOneSpy).toHaveBeenCalledTimes(2);
  });

  it('should return 200 and updated friend lists if the operation is successful', async () => {
    const mockCurrentUser = {
      _id: 'currentUserId',
      username: 'testUser1',
      friends: ['testUser2', 'testUser3'],
    };

    const mockFriendUser = {
      _id: 'friendUserId',
      username: 'testUser2',
      friends: ['testUser1', 'testUser4'],
    };

    const updatedMockCurrentUser = {
      _id: 'currentUserId',
      friends: ['testUser3'], // Updated friends list after removal
    };

    const updatedMockFriendUser = {
      _id: 'friendUserId',
      friends: ['testUser4'], // Updated friends list after removal
    };
    // Mock database operations
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce(mockCurrentUser) // Find current user
      .mockResolvedValueOnce(mockFriendUser); // Find friend user

    jest
      .spyOn(UserModel, 'findByIdAndUpdate')
      .mockResolvedValueOnce(updatedMockCurrentUser) // Update current user's friends
      .mockResolvedValueOnce(updatedMockFriendUser); // Update friend's friends

    jest
      .spyOn(UserModel, 'findById')
      .mockResolvedValueOnce(updatedMockCurrentUser) // Retrieve updated current user
      .mockResolvedValueOnce(updatedMockFriendUser); // Retrieve updated friend user

    const response = await supertest(app)
      .post('/friendship/deleteFriend')
      .send({ currentUsername: 'testUser1', friendUsername: 'testUser2' });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Friend deleted successfully.');
  });

  it('should return 400 if any user is invalid', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ id: '673f77ab688a1b22e200e1db', username: 'oliver@gmail.com' })
      .mockResolvedValueOnce({ id: '673f788d688a1b22e200e227', username: 'aiku@gmail.com' });

    jest
      .spyOn(UserModel, 'findById')
      .mockResolvedValueOnce({
        _id: '673f77ab688a1b22e200e1db',
        friends: ['673f7160678bd631ba5d1cdf', '673f694b678bd631ba5d1c14'],
      })
      .mockResolvedValueOnce(null);

    jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const response = await supertest(app).post('/friendship/deleteFriend').send({
      currentUsername: 'oliver@gmail.com',
      friendUsername: 'aiku@gmail.com',
    });
    // Assertions
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User not found.');
  });

  it('should return 500 if there is an error deleting the friend', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockResolvedValueOnce({ username: 'testUser1', friends: ['testUser2', 'testUser3'] });
    jest.spyOn(UserModel, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Database error'));
    const response = await supertest(app)
      .post('/friendship/deleteFriend')
      .send({ currentUsername: 'testUser1', friendUsername: 'testUser2' });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error deleting friends');
  });
});
