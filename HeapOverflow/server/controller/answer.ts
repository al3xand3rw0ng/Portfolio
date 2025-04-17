import express, { Response } from 'express';
import {
  Answer,
  AnswerRequest,
  AnswerResponse,
  FakeSOSocket,
  AnswerByAuthorRequest,
} from '../types';
import { addAnswerToQuestion, populateDocument, saveAnswer } from '../models/application';
import AnswerModel from '../models/answers';
import UserModel from '../models/users';
import { createNotification } from './userNotification';
import QuestionModel from '../models/questions';

const answerController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;

    try {
      const ansFromDb = await saveAnswer(ansInfo);

      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const status = await addAnswerToQuestion(qid, ansFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');

      if (populatedAns && 'error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
      });

      const question = await QuestionModel.findById(qid);
      const answerAuthor = await UserModel.findOne({ username: ansInfo.ansBy });

      if (!question) {
        res.status(404).send('Question not found');
        return;
      }

      const notificationPromises: Promise<void>[] = [];

      if (question) {
        const questionAuthor = await UserModel.findOne({ username: question.askedBy });
        if (answerAuthor?.friends?.length && !questionAuthor?.friends?.includes(ansInfo.ansBy)) {
          const content = `Your friend ${ansInfo.ansBy} just posted a new answer to the question, "${question.title}" !`;
          notificationPromises.push(
            createNotification(
              socket,
              answerAuthor.friends,
              ansInfo.ansBy,
              content,
              'question',
              qid,
            ),
          );
        }

        if (question.askedBy !== ansInfo.ansBy) {
          if (questionAuthor) {
            const isFriend = questionAuthor.friends?.includes(ansInfo.ansBy);
            const content = isFriend
              ? `Your friend ${ansInfo.ansBy} just answered your question: "${question.title}" !`
              : `${ansInfo.ansBy} just answered your question: "${question.title}" !`;
            notificationPromises.push(
              createNotification(
                socket,
                [question.askedBy],
                ansInfo.ansBy,
                content,
                'question',
                qid,
              ),
            );
          }
        }
      }
      await Promise.all(notificationPromises);

      res.json(ansFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves answers by the author from the database.
   *
   * @param req Request object containing the author of the answer
   * @param res Response object containing the answers by the author
   */
  const getAnswerByAuthor = async (req: AnswerByAuthorRequest, res: Response): Promise<void> => {
    const { ansBy } = req.query;
    try {
      if (!ansBy) {
        throw new Error('Invalid request');
      }
      const answers = await AnswerModel.find({ ansBy });
      res.json(answers);
    } catch (error) {
      res.status(500).send(`Error when getting answers by author`);
    }
  };

  router.post('/addAnswer', addAnswer);
  router.get('/getAnswerByAuthor', getAnswerByAuthor);

  return router;
};

export default answerController;
