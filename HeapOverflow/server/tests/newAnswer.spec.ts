import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import AnswerModel from '../models/answers';
import UserModel from '../models/users';
import UserNotification from '../models/userNotifications';
import QuestionModel from '../models/questions';

const saveAnswerSpy = jest.spyOn(util, 'saveAnswer');
const addAnswerToQuestionSpy = jest.spyOn(util, 'addAnswerToQuestion');
const popDocSpy = jest.spyOn(util, 'populateDocument');

describe('POST /addAnswer', () => {
  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return bad request error if answer text property is missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid answer');
  });

  it('should return bad request error if request body has qid property missing', async () => {
    const mockReqBody = {
      ans: {
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansBy property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if answer object has ansDateTime property missing', async () => {
    const mockReqBody = {
      qid: 'dummyQuestionId',
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
      },
    };

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if request body is missing', async () => {
    const response = await supertest(app).post('/answer/addAnswer');

    expect(response.status).toBe(400);
  });

  it('should return database error in response if saveAnswer method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    saveAnswerSpy.mockResolvedValueOnce({ error: 'Error when saving an answer' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if update question method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId().toString();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce({ error: 'Error when adding answer to question' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return database error in response if `populateDocument` method throws an error', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: new ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);
    addAnswerToQuestionSpy.mockResolvedValueOnce(mockQuestion);
    popDocSpy.mockResolvedValueOnce({ error: 'Error when populating document' });

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should add a new answer to the question', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
    });

    jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce({ validQid });
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce('dummyUserId');

    const content = `Your friend ${mockAnswer.ansBy} just posted a new answer to the question,'This is a test question' !`;

    jest.spyOn(UserNotification, 'insertMany').mockResolvedValueOnce([
      new UserNotification({
        sender: 'admin',
        recipient: 'dummyUserId',
        content,
        type: 'question',
        questionId: validQid,
        isRead: false,
        createdAt: new Date(),
      }),
    ]);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      comments: [],
    });
  });

  it('should add a new answer to the question and send a notification to friends ', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'questionAuthorId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    };

    const mockUser = {
      username: 'dummyUserId',
      friends: ['friend1', 'friend2'],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
    });

    jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(mockQuestion);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser);

    const content = `Your friend ${mockAnswer.ansBy} just posted a new answer to the question,'This is a test question' !`;

    jest.spyOn(UserNotification, 'insertMany').mockResolvedValueOnce([
      new UserNotification({
        sender: 'admin',
        recipient: 'friend1',
        content,
        type: 'question',
        questionId: validQid,
        isRead: false,
        createdAt: new Date(),
      }),
      new UserNotification({
        sender: 'admin',
        recipient: 'friend2',
        content,
        type: 'question',
        questionId: validQid,
        isRead: false,
        createdAt: new Date(),
      }),
    ]);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      comments: [],
    });
  });

  it('should add a new answer to the question and notify the author if ansBy is friend', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();

    const mockUser = {
      _id: 'friend1',
      username: 'friend1',
      friends: ['questionAuthorId'],
    };

    const mockUser2 = {
      _id: 'questionAuthorId',
      username: 'questionAuthorId',
      friends: [mockUser._id],
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: mockUser._id,
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    const mockReqBody = {
      qid: validQid,
      ans: mockAnswer,
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: mockUser2._id,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: mockUser2._id,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: mockUser2._id,
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
    });

    jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(mockQuestion);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser2);

    expect(mockQuestion.askedBy !== mockAnswer.ansBy).toBe(true); // Ensure the block is entered

    const isFriend = mockUser2.friends.includes(mockUser._id);

    const content = isFriend
      ? `Your friend ${mockAnswer.ansBy} just answered your question: "${mockQuestion.title}" !`
      : `${mockAnswer.ansBy} just answered your question: "${mockQuestion.title}" !`;

    jest.spyOn(UserNotification, 'insertMany').mockResolvedValueOnce([
      new UserNotification({
        sender: 'admin',
        recipient: 'questionAuthorId',
        content,
        type: 'question',
        questionId: validQid,
        isRead: false,
        createdAt: new Date(),
      }),
    ]);

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: mockUser._id,
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      comments: [],
    });
  });

  it('should add a new answer to the question and notify the author if ansBy is not friend', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'user1',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'user1',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    const mockQuestion = {
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'author',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    };

    const mockUser = {
      _id: 'author',
      username: 'author',
      friends: [] as string[],
    };

    const mockUser2 = {
      _id: 'user1',
      username: 'user1',
      friends: [] as string[],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'author',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'author',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
    });

    jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(mockQuestion);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser2);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(mockUser);

    expect(mockQuestion.askedBy !== mockAnswer.ansBy).toBe(true);

    const isFriend = mockUser.friends.includes(mockAnswer.ansBy);
    const content = isFriend
      ? `Your friend ${mockAnswer.ansBy} just answered your question: "${mockQuestion.title}" !`
      : `${mockAnswer.ansBy} just answered your question: "${mockQuestion.title}" !`;

    jest.spyOn(UserNotification, 'insertMany').mockResolvedValueOnce([
      new UserNotification({
        sender: 'admin',
        recipient: 'author',
        content,
        type: 'question',
        questionId: validQid,
        isRead: false,
        createdAt: new Date(),
      }),
    ]);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validAid.toString(),
      text: 'This is a test answer',
      ansBy: 'user1',
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
      comments: [],
    });
  });

  it('should return 404 if the question is not found', async () => {
    const validQid = new mongoose.Types.ObjectId();
    const validAid = new mongoose.Types.ObjectId();
    const mockReqBody = {
      qid: validQid,
      ans: {
        text: 'This is a test answer',
        ansBy: 'dummyUserId',
        ansDateTime: new Date('2024-06-03'),
      },
    };

    const mockAnswer = {
      _id: validAid,
      text: 'This is a test answer',
      ansBy: 'dummyUserId',
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    saveAnswerSpy.mockResolvedValueOnce(mockAnswer);

    addAnswerToQuestionSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer._id],
      comments: [],
    });

    popDocSpy.mockResolvedValueOnce({
      _id: validQid,
      title: 'This is a test question',
      text: 'This is a test question',
      tags: [],
      askedBy: 'dummyUserId',
      askDateTime: new Date('2024-06-03'),
      views: [],
      upVotes: [],
      downVotes: [],
      answers: [mockAnswer],
      comments: [],
    });

    jest.spyOn(QuestionModel, 'findById').mockResolvedValueOnce(null);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce('dummyUserId');

    const response = await supertest(app).post('/answer/addAnswer').send(mockReqBody);
    expect(response.status).toBe(404);
    expect(response.text).toBe('Question not found');
  });

  // it('should create a notification with "Your friend" when the answer is by a friend', async () => {
  //   const question = {
  //     _id: 'questionId',
  //     title: 'Test Question',
  //     askedBy: 'user2',
  //   };
  //   const ansInfo = {
  //     ansBy: 'friend1',
  //   };
  //   const questionAuthor = {
  //     username: 'user2',
  //     friends: ['friend1', 'friend2'], // Includes ansInfo.ansBy
  //   };

  //   // Simulate condition
  //   expect(question.askedBy !== ansInfo.ansBy).toBe(true); // Ensure the block is entered

  //   const isFriend = questionAuthor.friends.includes(ansInfo.ansBy);
  //   const content = isFriend
  //     ? `Your friend ${ansInfo.ansBy} just answered your question: "${question.title}" !`
  //     : `${ansInfo.ansBy} just answered your question: "${question.title}" !`;

  //   // Assertions
  //   expect(isFriend).toBe(true);
  //   expect(content).toBe(
  //     `Your friend ${ansInfo.ansBy} just answered your question: "${question.title}" !`
  //   );
  // });

  // it('should create a notification without "Your friend" when the answer is not by a friend', async () => {
  //   const question = {
  //     _id: 'questionId',
  //     title: 'Test Question',
  //     askedBy: 'user2',
  //   };
  //   const ansInfo = {
  //     ansBy: 'stranger1',
  //   };
  //   const questionAuthor = {
  //     username: 'user2',
  //     friends: ['friend1', 'friend2'], // Does not include ansInfo.ansBy
  //   };

  //   // Simulate condition
  //   expect(question.askedBy !== ansInfo.ansBy).toBe(true); // Ensure the block is entered

  //   const isFriend = questionAuthor.friends.includes(ansInfo.ansBy);
  //   const content = isFriend
  //     ? `Your friend ${ansInfo.ansBy} just answered your question: "${question.title}" !`
  //     : `${ansInfo.ansBy} just answered your question: "${question.title}" !`;

  //   // Assertions
  //   expect(isFriend).toBe(false);
  //   expect(content).toBe(
  //     `${ansInfo.ansBy} just answered your question: "${question.title}" !`
  //   );
  // });
});

describe('GET /getAnswerByAuthor', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return answers by the author', async () => {
    const mockReqQuery = {
      ansBy: 'dummyUserId',
    };

    const mockAnswer = {
      _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
      text: 'This is a test answer',
      ansBy: mockReqQuery.ansBy,
      ansDateTime: new Date('2024-06-03'),
      comments: [],
    };

    jest.spyOn(AnswerModel, 'find').mockResolvedValueOnce([mockAnswer]);

    const response = await supertest(app).get(
      `/answer/getAnswerByAuthor?ansBy=${mockReqQuery.ansBy}`,
    );

    const expectedResponse = {
      ...mockAnswer,
      _id: mockAnswer._id.toString(),
      ansDateTime: mockAnswer.ansDateTime.toISOString(),
    };

    expect(response.status).toBe(200);
    expect(response.body).toEqual([expectedResponse]);
    expect(AnswerModel.find).toHaveBeenCalledWith({ ansBy: mockReqQuery.ansBy });
  });

  it('should return bad request error if author is missing', async () => {
    const response = await supertest(app).get('/answer/getAnswerByAuthor');

    expect(response.status).toBe(500);
  });
});
