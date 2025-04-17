import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import { FakeSOSocket } from '../types';
import UserNotificationModel from '../models/userNotifications';
import UserModel from '../models/users';
import { createNotification } from '../controller/userNotification';

describe('User Notification Controller Tests', () => {
  let mockSocket: FakeSOSocket;

  beforeEach(() => {
    mockSocket = { emit: jest.fn() } as unknown as FakeSOSocket;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /getNotifications', () => {
    it('should return notifications for a user', async () => {
      const mockNotifications = [
        {
          _id: '67482652efaa5dab15872581',
          sender: 'special@gmail.com',
          recipient: 'kogmaw@gmail.com',
          content: 'You have a new friend request from special@gmail.com.',
          type: 'request',
          questionId: null,
          isRead: false,
          createdAt: '2024-11-28T08:14:10.660Z',
          __v: 0,
        },
        {
          _id: '6748114ff3c5fe6d36616328',
          sender: 'scar@gmail.com',
          recipient: 'kogmaw@gmail.com',
          content: 'You have a new friend request from scar@gmail.com.',
          type: 'request',
          questionId: null,
          isRead: false,
          createdAt: '2024-11-28T06:44:31.247Z',
          __v: 0,
        },
      ];

      const mockReqQuery = {
        username: 'kogmaw@gmail.com',
      };

      jest.spyOn(UserNotificationModel, 'find').mockImplementation(
        () =>
          ({
            sort: jest.fn().mockResolvedValueOnce([
              {
                _id: '67482652efaa5dab15872581',
                sender: 'special@gmail.com',
                recipient: 'kogmaw@gmail.com',
                content: 'You have a new friend request from special@gmail.com.',
                type: 'request',
                questionId: null,
                isRead: false,
                createdAt: '2024-11-28T08:14:10.660Z',
                __v: 0,
              },
              {
                _id: '6748114ff3c5fe6d36616328',
                sender: 'scar@gmail.com',
                recipient: 'kogmaw@gmail.com',
                content: 'You have a new friend request from scar@gmail.com.',
                type: 'request',
                questionId: null,
                isRead: false,
                createdAt: '2024-11-28T06:44:31.247Z',
                __v: 0,
              },
            ]),
          }) as unknown as ReturnType<typeof UserNotificationModel.find>,
      );

      const response = await supertest(app).get(
        `/notification/getNotifications?username=${mockReqQuery.username}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNotifications);
    });

    it('should return 500 if an error occurs', async () => {
      jest.spyOn(UserNotificationModel, 'find').mockImplementationOnce(() => {
        throw new Error('Error when retrieving notifications');
      });

      const response = await supertest(app)
        .get('/notification/getNotifications')
        .query({ username: 'testUser' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when retrieving notifications');
    });
  });

  describe('POST /markAsRead', () => {
    it('should mark a notification as read successfully', async () => {
      const validNid = new mongoose.Types.ObjectId();

      const mockNotification = {
        _id: validNid,
        recipient: 'dummyUserId',
        sender: 'admin',
        content: 'This is a test notification.',
        type: 'question',
        questionId: new mongoose.Types.ObjectId().toString(),
        isRead: false,
        createdAt: new Date(),
      };

      jest.spyOn(UserNotificationModel, 'findByIdAndUpdate').mockResolvedValueOnce({
        ...mockNotification,
        isRead: true,
      });

      const response = await supertest(app)
        .post('/notification/markAsRead')
        .send({ nid: validNid.toString() });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Notification marked as read');
      expect(UserNotificationModel.findByIdAndUpdate).toHaveBeenCalledWith(validNid.toString(), {
        isRead: true,
      });
    });

    it('should return 500 if an error occurs', async () => {
      jest
        .spyOn(UserNotificationModel, 'findByIdAndUpdate')
        .mockRejectedValueOnce(new Error('Update error'));

      const response = await supertest(app).post('/notification/markAsRead').send({ nid: '1' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when marking notification as read');
    });
  });
  describe('createNotification', () => {
    beforeEach(() => {
      mockSocket = { emit: jest.fn() } as unknown as FakeSOSocket;
      jest.clearAllMocks();
    });

    // afterAll(async () => {
    //   await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    // });

    it('should create notifications and emit updates successfully', async () => {
      // Mock data
      const recipients = ['user1', 'user2'];
      const sender = 'admin';
      const content = 'You have a new notification';
      const type = 'question';
      const questionId = '12345';

      // Mock database methods
      jest
        .spyOn(UserNotificationModel, 'insertMany')
        .mockResolvedValueOnce([
          new UserNotificationModel({ _id: new mongoose.Types.ObjectId(), recipient: 'user1' }),
          new UserNotificationModel({ _id: new mongoose.Types.ObjectId(), recipient: 'user2' }),
        ]);
      jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

      // Call the function
      await createNotification(mockSocket, recipients, sender, content, type, questionId);

      // Assert database interactions
      expect(UserNotificationModel.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({ sender, recipient: 'user1', content, type }),
        expect.objectContaining({ sender, recipient: 'user2', content, type }),
      ]);
      expect(UserModel.findOneAndUpdate).toHaveBeenCalledTimes(2);

      // Assert WebSocket emissions
      //   expect(mockSocket.emit).toHaveBeenCalledTimes(2);
      //   expect(mockSocket.emit).toHaveBeenCalledWith('notificationUpdate', {
      //     sender,
      //     recipient: 'user1',
      //     content,
      //     type,
      //     questionId,
      //     createdAt: expect.any(Date),
      //   });
      //   expect(mockSocket.emit).toHaveBeenCalledWith('notificationUpdate', {
      //     sender,
      //     recipient: 'user2',
      //     content,
      //     type,
      //     questionId,
      //     createdAt: expect.any(Date),
      //   });
    });

    it('should handle failure in UserNotificationModel.insertMany', async () => {
      const recipients = ['user1'];
      const sender = 'admin';
      const content = 'Test notification';
      const type = 'request';

      // Simulate a failure
      jest
        .spyOn(UserNotificationModel, 'insertMany')
        .mockRejectedValueOnce(new Error('Insert failed'));

      jest.spyOn(UserModel, 'findOneAndUpdate').mockImplementation();

      await expect(
        createNotification(mockSocket, recipients, sender, content, type),
      ).rejects.toThrow('Insert failed');

      expect(UserModel.findOneAndUpdate).not.toHaveBeenCalled();
      // expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should handle an empty recipients array gracefully', async () => {
      const recipients: string[] = [];
      const sender = 'admin';
      const content = 'Empty recipients test';
      const type = 'question';

      await createNotification(mockSocket, recipients, sender, content, type);

      // Ensure no database operations or WebSocket emissions are performed
      expect(UserNotificationModel.insertMany).not.toHaveBeenCalled();
      expect(UserModel.findOneAndUpdate).not.toHaveBeenCalled();
      // expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });
});
