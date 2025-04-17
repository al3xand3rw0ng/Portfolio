import mongoose, { Query } from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import UserNotificationModel from '../models/userNotifications';
import UserModel from '../models/users';
import { Answer, Question, Tag, User } from '../types';

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
  description: 'tag2 description',
};

const mockQuestion: Question = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
  title: 'New Question Title',
  text: 'New Question Text',
  tags: [tag1, tag2],
  answers: [],
  askedBy: 'question3_user',
  askDateTime: new Date('2024-06-06'),
  views: [],
  upVotes: [],
  downVotes: [],
  comments: [],
};

const simplifyQuestion = (question: Question) => ({
  ...question,
  _id: question._id?.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })), // Converting tag ObjectId
  answers: question.answers.map(answer => ({
    ...answer,
    _id: answer._id?.toString(),
    ansDateTime: (answer as Answer).ansDateTime.toISOString(),
  })), // Converting answer ObjectId
  askDateTime: question.askDateTime.toISOString(),
});

describe('POST /addQuestion', () => {
  afterEach(async () => {
    // await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should add a new question', async () => {
    jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveQuestion').mockResolvedValueOnce(mockQuestion as Question);
    jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(simplifyQuestion(mockQuestion));
  });

  it('should find a user by username and populate friends', async () => {
    const mockUser = {
      _id: 'userId',
      username: 'question3_user',
      friends: [
        { _id: 'friendId1', username: 'friend1' },
        { _id: 'friendId2', username: 'friend2' },
      ],
      populate: jest.fn().mockResolvedValueOnce(this),
    };

    const mockQuery: Partial<Query<User, User>> = {
      populate: jest.fn().mockResolvedValue(mockUser),
    };

    const findOneMock = jest
      .spyOn(UserModel, 'findOne')
      .mockReturnValue(mockQuery as Query<User, User>);

    const user = await UserModel.findOne({ username: 'question3_user' }).populate('friends');

    expect(findOneMock).toHaveBeenCalledWith({ username: 'question3_user' });
    expect(user).toEqual(mockUser);
  });

  it('should return 500 if error occurs in `saveQuestion` while adding a new question', async () => {
    jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest
      .spyOn(util, 'saveQuestion')
      .mockResolvedValueOnce({ error: 'Error while saving question' });

    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    expect(response.status).toBe(500);
  });

  it('should return 500 if error occurs in `saveQuestion` while adding a new question', async () => {
    jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveQuestion').mockResolvedValueOnce(mockQuestion as Question);
    jest.spyOn(util, 'populateDocument').mockResolvedValueOnce({ error: 'Error while populating' });

    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    expect(response.status).toBe(500);
  });

  it('should return 500 if tag ids could not be retrieved', async () => {
    jest.spyOn(util, 'processTags').mockResolvedValue([]);

    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    expect(response.status).toBe(500);
  });

  it('should return bad request if question title is empty string', async () => {
    const response = await supertest(app)
      .post('/question/addQuestion')
      .send({ ...mockQuestion, title: '' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should return bad request if question text is empty string', async () => {
    const response = await supertest(app)
      .post('/question/addQuestion')
      .send({ ...mockQuestion, text: '' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should return bad request if tags are empty', async () => {
    const response = await supertest(app)
      .post('/question/addQuestion')
      .send({ ...mockQuestion, tags: [] });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should return bad request if askedBy is empty string', async () => {
    const response = await supertest(app)
      .post('/question/addQuestion')
      .send({ ...mockQuestion, askedBy: '' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should ensure only unique tags are added', async () => {
    // Mock request body with duplicate tags
    const mockQuestionDuplicates: Question = {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
      title: 'New Question Title',
      text: 'New Question Text',
      tags: [tag1, tag1, tag2, tag2], // Duplicate tags
      answers: [],
      askedBy: 'question3_user',
      askDateTime: new Date('2024-06-06'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
    };

    const result: Question = {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
      title: 'New Question Title',
      text: 'New Question Text',
      tags: [tag1, tag2], // Duplicate tags
      answers: [],
      askedBy: 'question3_user',
      askDateTime: new Date('2024-06-06'),
      views: [],
      upVotes: [],
      downVotes: [],
      comments: [],
    };

    // Set up the mock to resolve with unique tags
    jest.spyOn(util, 'processTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveQuestion').mockResolvedValueOnce({
      ...mockQuestionDuplicates,
      tags: [tag1, tag2], // Ensure only unique tags are saved
    });

    jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(result);

    jest
      .spyOn(UserNotificationModel, 'insertMany')
      .mockResolvedValueOnce([new UserNotificationModel({ _id: 'userId', recipient: 'user1' })]);
    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(simplifyQuestion(result)); // Expect only unique tags
  });
});
