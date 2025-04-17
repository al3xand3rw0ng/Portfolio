import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import UserModel from '../models/users';

const saveUserSpy = jest.spyOn(util, 'saveUser');

describe('POST /addUser', () => {
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
    notifications: [],
    chats: [],
    settings: {
      colorMode: 'light',
      fontSize: 'md',
      isBlackAndWhite: false,
    },
  };

  it('should add a new user', async () => {
    saveUserSpy.mockResolvedValueOnce(mockUser);
    const response = await supertest(app).post('/user/addUser').send(mockUser);
    expect(util.saveUser).toHaveBeenCalledWith(mockUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it('should return 400 if error occurs in `saveUser` while adding a new user', async () => {
    saveUserSpy.mockResolvedValueOnce({ error: 'Error while saving user' });
    const response = await supertest(app).post('/user/addUser').send({ mockUser });
    expect(response.status).toBe(400);
  });
});

describe('GET /getUser', () => {
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
  };

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(UserModel, 'findOne')
      .mockRejectedValueOnce(new Error('Unexpected error during update'));
    const response = await supertest(app).get(`/user/getUser?username=${mockUser.username}`);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error when finding user' });
  });

  it('should return user information', async () => {
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser);
    const response = await supertest(app).get(`/user/getUser?username=${mockUser.username}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(UserModel.findOne).toHaveBeenCalledWith({ username: mockUser.username });
  });

  it('should return 400 if user is not found', async () => {
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
    const response = await supertest(app).get('/user/getUser');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'User not found.' });
  });
});

describe('GET /getAllUsers', () => {
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

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(UserModel, 'find')
      .mockRejectedValueOnce(new Error('Unexpected error during update'));
    const response = await supertest(app).get('/user/getAllUsers');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error when retrieving users' });
  });

  it('should return all users', async () => {
    jest.spyOn(UserModel, 'find').mockResolvedValueOnce([mockUser]);
    const response = await supertest(app).get('/user/getAllUsers');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockUser]);
    expect(UserModel.find).toHaveBeenCalled();
  });
});

describe('PUT /updateUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  const mockUpdateData = {
    firstName: 'updated',
    lastname: 'user',
  };

  const mockUser = {
    picture: 'https://www.google.com',
    username: 'testUser',
    firstName: 'updated',
    lastName: 'user',
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
    notifications: [],
    chats: [],
    settings: {
      colorMode: 'light',
      fontSize: 'md',
      isBlackAndWhite: false,
    },
  };

  it('should update user information', async () => {
    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(mockUser);
    const response = await supertest(app)
      .put(`/user/updateUser/${mockUser.username}`)
      .send(mockUpdateData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { username: mockUser.username },
      mockUpdateData,
      { new: true, runValidators: true },
    );
  });

  it('should return 500 if user is not found', async () => {
    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app)
      .put(`/user/updateUser/${mockUser.username}`)
      .send(mockUpdateData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Error when updating user: Error: User not found',
    });

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { username: mockUser.username },
      mockUpdateData,
      { new: true, runValidators: true },
    );
  });

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(UserModel, 'findOneAndUpdate')
      .mockRejectedValueOnce(new Error('Unexpected error during update'));

    const response = await supertest(app)
      .put(`/user/updateUser/${mockUser.username}`)
      .send(mockUpdateData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Error when updating user: Error: Unexpected error during update',
    });

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { username: mockUser.username },
      mockUpdateData,
      { new: true, runValidators: true },
    );
  });

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(UserModel, 'findOneAndUpdate')
      .mockRejectedValueOnce(new Error('Unexpected error during update'));

    const response = await supertest(app)
      .put(`/user/updateUser/${mockUser.username}`)
      .send(mockUpdateData);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Error when updating user: Error: Unexpected error during update',
    });

    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { username: mockUser.username },
      mockUpdateData,
      { new: true, runValidators: true },
    );
  });
});
