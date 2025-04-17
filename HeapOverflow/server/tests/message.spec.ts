import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import MessageModel from '../models/messages';
import ChatModel from '../models/chats';

describe('Message Controller Tests', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /sendMessage', () => {
    afterEach(async () => {
      await mongoose.connection.close();
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await mongoose.disconnect();
    });

    it('should send a message to another user', async () => {
      const mockMessage = {
        _id: '674c16afd12749608325b609',
        sender: 'testuser',
        chatId: 'chat123',
        message: 'Hello!',
        createdAt: new Date('2024-12-01T08:00:00.000Z'),
      };
      MessageModel.prototype.save = jest.fn().mockResolvedValue(mockMessage);
      jest.spyOn(ChatModel, 'findByIdAndUpdate').mockResolvedValue({ messages: [mockMessage._id] });
      const response = await supertest(app).post('/message/sendMessage').send({
        sender: mockMessage.sender,
        chatId: mockMessage.chatId,
        message: mockMessage.message,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Message sent.');
    });

    it('should return an error if the message data is invalid', async () => {
      const response = await supertest(app).post('/message/sendMessage').send({
        sender: 'testuser',
        chatId: 'chat123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid message data.');
    });

    it('should return an error if the sender is invalid', async () => {
      const response = await supertest(app).post('/message/sendMessage').send({
        chatId: 'chat123',
        message: 'Hello!',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid message data.');
    });

    it('should return an error if the chat id is invalid', async () => {
      const response = await supertest(app).post('/message/sendMessage').send({
        sender: 'testuser',
        message: 'Hello!',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid message data.');
    });

    it('should return an error if there is an error when sending the message', async () => {
      MessageModel.prototype.save = jest.fn().mockRejectedValue(new Error('Test error'));
      const response = await supertest(app).post('/message/sendMessage').send({
        sender: 'testuser',
        chatId: 'chat123',
        message: 'Hello!',
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error when sending message: Error: Test error');
    });
  });

  describe('GET /getMessages', () => {
    it('should return 400 if chatId is not provided', async () => {
      const response = await supertest(app).get('/message/getMessages');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid chat ID.' });
    });

    it('should return messages for a valid chatId', async () => {
      const mockMessages = [
        {
          _id: '67482652efaa5dab15872581',
          sender: 'user1',
          chatId: '12345',
          message: 'Hello!',
          createdAt: '2024-12-01T08:09:58.321Z',
        },
        {
          _id: '6748114ff3c5fe6d36616328',
          sender: 'user2',
          chatId: '12345',
          message: 'Hi there!',
          createdAt: '2024-12-01T08:10:36.321Z',
        },
      ];

      jest.spyOn(MessageModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockResolvedValueOnce(mockMessages),
          }) as unknown as ReturnType<typeof MessageModel.find>,
      );

      const response = await supertest(app).get('/message/getMessages').query({ chatId: '12345' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ messages: mockMessages });
      expect(MessageModel.find).toHaveBeenCalledWith({ chatId: '12345' });
    });

    it('should return 500 if an error occurs during message retrieval', async () => {
      jest.spyOn(MessageModel, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await supertest(app).get('/message/getMessages').query({ chatId: '12345' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Error when retrieving messages: Error: Database error',
      });
    });
  });
});
