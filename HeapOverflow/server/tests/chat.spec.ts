import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import ChatModel from '../models/chats';
import UserModel from '../models/users';

describe('Message Controller Tests', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /createChat', () => {
    it('should create a chat between two users', async () => {
      const participants = ['testuser1', 'testuser2'];
      const mockChat = {
        _id: 'chat123',
        participants,
        createdAt: new Date('2024-12'),
      };
      jest
        .spyOn(UserModel, 'findOne')
        .mockResolvedValue({ username: 'testuser1', friends: ['testuser2'] });
      jest.spyOn(ChatModel, 'findOne').mockResolvedValue(null);

      jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValue({ chats: [mockChat._id] });

      const response = await supertest(app)
        .post('/chat/createChat')
        .send({ participants: mockChat.participants });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('participants');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toMatchObject({ participants });
    });

    it('should return an existing chat if one already exists', async () => {
      const mockChat = {
        _id: 'chat123',
        participants: ['testuser1', 'testuser2'],
        createdAt: '2024-12-01T08:00:00.000Z',
      };

      jest
        .spyOn(UserModel, 'findOne')
        .mockResolvedValue({ username: 'testuser1', friends: ['testuser2'] });
      ChatModel.findOne = jest.fn().mockResolvedValue(mockChat);
      const response = await supertest(app)
        .post('/chat/createChat')
        .send({ participants: mockChat.participants });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockChat);
    });

    it('should return an error if the participants are not friends', async () => {
      const mockChat = {
        _id: 'chat123',
        participants: ['testuser1', 'testuser2'],
        createdAt: new Date('2024-12-01T08:00:00.000Z'),
      };

      jest.spyOn(UserModel, 'findOne').mockResolvedValue({ username: 'testuser1', friends: [] });

      const response = await supertest(app)
        .post('/chat/createChat')
        .send({ participants: mockChat.participants });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('You can only create chats with friends.');
    });

    it('should return an error if the user is not found', async () => {
      jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);
      const response = await supertest(app)
        .post('/chat/createChat')
        .send({ participants: ['testuser1', 'testuser2'] });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User not found.');
    });

    it('should return an error if the participants are not valid', async () => {
      const response = await supertest(app)
        .post('/chat/createChat')
        .send({ participants: ['testuser1'] });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('At least two participants are required.');
    });

    it('should return a 500 error if creating a chat fails', async () => {
      jest
        .spyOn(UserModel, 'findOne')
        .mockResolvedValue({ username: 'testuser1', friends: ['testuser2'] });
      jest.spyOn(ChatModel, 'findOne').mockRejectedValue(new Error('Database error'));
      const response = await supertest(app)
        .post('/chat/createChat')
        .send({ participants: ['testuser1', 'testuser2'] });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Error when creating chat: Error: Database error' });
    });
  });

  describe('GET /getUserChats', () => {
    it('should return all chats for a user', async () => {
      const mockChats = [
        {
          _id: 'chat123',
          participants: ['testuser1', 'testuser2'],
          createdAt: '2024-12-01T08:00:00.000Z',
        },
        {
          _id: 'chat456',
          participants: ['testuser1', 'testuser3'],
          createdAt: '2024-12-01T08:00:00.000Z',
        },
      ];

      jest.spyOn(ChatModel, 'find').mockResolvedValue(mockChats);
      const response = await supertest(app)
        .get('/chat/getUserChats')
        .query({ username: 'testuser1' });

      const expectedChats = mockChats.map(chat => ({
        _id: chat._id,
        participants: chat.participants,
        createdAt: chat.createdAt,
      }));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ chats: expectedChats });
    });

    it('should return 400 if the username is not provided', async () => {
      const response = await supertest(app).get('/chat/getUserChats');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Username is required.');
    });

    it('should return a 500 error if retrieving chats fails', async () => {
      jest.spyOn(ChatModel, 'find').mockRejectedValue(new Error('Database error'));
      const response = await supertest(app)
        .get('/chat/getUserChats')
        .query({ username: 'testuser1' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when retrieving chats');
    });
  });

  describe('GET /getChat', () => {
    it('should return a chat by id', async () => {
      const mockChat = {
        _id: 'chat123',
        participants: ['testuser1', 'testuser2'],
        createdAt: '2024-12-01T08:00:00.000Z',
      };

      jest.spyOn(ChatModel, 'findById').mockResolvedValue(mockChat);
      const response = await supertest(app).get('/chat/getChat').query({ chatId: 'chat123' });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockChat);
    });

    it('should return an error if the chat is not found', async () => {
      jest.spyOn(ChatModel, 'findById').mockResolvedValue(null);
      const response = await supertest(app).get('/chat/getChat').query({ chatId: 'chat123' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Chat not found.');
      expect(ChatModel.findById).toHaveBeenCalledWith('chat123');
    });

    it('should return an error if the chat id is not provided', async () => {
      const response = await supertest(app).get('/chat/getChat');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Chat ID is required.');
    });

    it('should return a 500 error if retrieving a chat fails', async () => {
      jest.spyOn(ChatModel, 'findById').mockRejectedValue(new Error('Database error'));
      const response = await supertest(app).get('/chat/getChat').query({ chatId: 'chat123' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when retrieving chat');
    });
  });
});
