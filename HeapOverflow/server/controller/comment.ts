import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import { Comment, AddCommentRequest, FakeSOSocket, CommentByAuthorRequest } from '../types';
import { addComment, populateDocument, saveComment } from '../models/application';
import CommentModel from '../models/comments';
import UserModel from '../models/users';
import QuestionModel from '../models/questions';
import { createNotification } from './userNotification';
import AnswerModel from '../models/answers';

const commentController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddCommentRequest): boolean =>
    !!req.body.id &&
    !!req.body.type &&
    (req.body.type === 'question' || req.body.type === 'answer') &&
    !!req.body.comment &&
    req.body.comment.text !== undefined &&
    req.body.comment.commentBy !== undefined &&
    req.body.comment.commentDateTime !== undefined;

  /**
   * Validates the comment object to ensure it is not empty.
   *
   * @param comment The comment to validate.
   *
   * @returns `true` if the coment is valid, otherwise `false`.
   */
  const isCommentValid = (comment: Comment): boolean =>
    comment.text !== undefined &&
    comment.text !== '' &&
    comment.commentBy !== undefined &&
    comment.commentBy !== '' &&
    comment.commentDateTime !== undefined &&
    comment.commentDateTime !== null;

  /**
   * Handles adding a new comment to the specified question or answer. The comment is first validated and then saved.
   * If the comment is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req The AddCommentRequest object containing the comment data.
   * @param res The HTTP response object used to send back the result of the operation.
   * @param type The type of the comment, either 'question' or 'answer'.
   *
   * @returns A Promise that resolves to void.
   */
  const addCommentRoute = async (req: AddCommentRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    const id = req.body.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    const commentInfo: Comment = req.body.comment;
    const { comment, type } = req.body;

    if (!isCommentValid(comment)) {
      res.status(400).send('Invalid comment body');
      return;
    }

    try {
      const comFromDb = await saveComment(commentInfo);

      if ('error' in comFromDb) {
        throw new Error(comFromDb.error);
      }

      const status = await addComment(id, type, comFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error);
      }

      // Populates the fields of the question or answer that this comment
      // was added to, and emits the updated object
      const populatedDoc = await populateDocument(id, type);

      if (populatedDoc && 'error' in populatedDoc) {
        throw new Error(populatedDoc.error);
      }

      socket.emit('commentUpdate', {
        result: populatedDoc,
        type,
      });

      // emit a notification to the friends of the comment author - Your friend just posted a comment on this question!
      const commentAuthor = await UserModel.findOne({ username: commentInfo.commentBy }).populate(
        'friends',
      );

      const notificationPromises: Promise<void>[] = [];

      if (type === 'question') {
        const question = await QuestionModel.findById(id);

        if (question) {
          if (question.askedBy !== commentInfo.commentBy) {
            const content = `${commentInfo.commentBy} just commented on your question: "${question.title}" !`;
            notificationPromises.push(
              createNotification(
                socket,
                [question.askedBy],
                commentInfo.commentBy,
                content,
                'question',
                id,
              ),
            );
          }
          if (commentAuthor?.friends?.length) {
            const friendUsernames = commentAuthor.friends.filter(
              friend => friend !== question.askedBy,
            );
            const content = `Your friend ${commentInfo.commentBy} just posted a new comment to the question, "${question.title}" !`;
            notificationPromises.push(
              createNotification(
                socket,
                friendUsernames,
                commentInfo.commentBy,
                content,
                'question',
                id,
              ),
            );
          }
        }
      } else if (type === 'answer') {
        const answer = await AnswerModel.findById(id);
        const question = await QuestionModel.findOne({ answers: answer?._id });

        if (answer && question) {
          if (answer.ansBy !== commentInfo.commentBy) {
            const content = `${commentInfo.commentBy} just commented on your answer to the question: "${question.title}" !`;
            notificationPromises.push(
              createNotification(
                socket,
                [answer.ansBy],
                commentInfo.commentBy,
                content,
                'question',
                question._id?.toString(),
              ),
            );
          }
          if (commentAuthor?.friends?.length) {
            const friendUsernames = commentAuthor.friends.filter(friend => friend !== answer.ansBy);
            const content = `Your friend ${commentInfo.commentBy} just posted a new comment to an answer of the question, "${question.title}" !`;
            notificationPromises.push(
              createNotification(
                socket,
                friendUsernames,
                commentInfo.commentBy,
                content,
                'question',
                question._id?.toString(),
              ),
            );
          }
        }
      }
      await Promise.all(notificationPromises);
      res.json(comFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding comment: ${(err as Error).message}`);
    }
  };

  const getCommentByAuthor = async (req: CommentByAuthorRequest, res: Response): Promise<void> => {
    const { commentBy } = req.query;
    try {
      if (!commentBy) {
        throw new Error('Invalid request');
      }
      const comments = await CommentModel.find({ commentBy });
      res.json(comments);
    } catch (error) {
      res.status(500).send(`Error when getting comments by author`);
    }
  };

  router.post('/addComment', addCommentRoute);
  router.get('/getCommentByAuthor', getCommentByAuthor);

  return router;
};

export default commentController;
