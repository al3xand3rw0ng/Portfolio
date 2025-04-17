import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'oldest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

export interface SendMessageRequest extends Request {
  body: {
    sender: string;
    receiver: string;
    message: string;
  };
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing the payload for a friend request update event, which contains:
 * - requester - The username of the user who sent the friend request.
 * - recipient - The username of the user who received the friend request.
 * - status - The status of the friend request, either 'pending' or 'accepted'.
 */
export interface FriendUpdatePayload {
  requester: string;
  recipient: string;
  status: 'pending' | 'accepted';
}

/**
 * Interface representing the payload for a friend list update event, which contains:
 * - username - The username of the user whose friend list was updated.
 * - friends - An array of usernames representing the user's friends.
 */
export interface FriendListUpdatePayload {
  username: string;
  friends: string[];
}

export interface NotificationUpdatePayload {
  sender: string;
  recipient: string;
  content: string;
  type: 'question' | 'request';
  questionId?: string;
  createdAt: Date;
}

export interface ReadNotificationUpdatePayload {
  nid: string;
}

export interface MessageUpdatePayload {
  sender: string;
  chatId: string;
  message: string;
  createdAt: Date;
}

export interface ChatUpdatePayload {
  participants: string[];
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  friendRequestUpdate: (update: FriendUpdatePayload) => void;
  friendListUpdate: (update: FriendListUpdatePayload) => void;
  notificationUpdate: (notification: NotificationUpdatePayload) => void;
  readNotificationUpdate: (notification: ReadNotificationUpdatePayload) => void;
  messageUpdate: (message: MessageUpdatePayload) => void;
  chatUpdate: (chat: ChatUpdatePayload) => void;
}

/**
 * Interface representing a User, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - username: The username of that user.
 * - firstName: The first name of the user.
 * - lastName: The last name of the user.
 * - biography: The user's short biography. Optional field.
 * - comments: All of the comments provided by the user.
 * - answers: All of the answers provided by the user.
 * - questions: All of the questions provided by the user.
 */
export interface User {
  _id?: ObjectId;
  picture: string;
  username: string;
  firstName: string;
  lastName: string;
  biography?: string;
  comments: Comment[] | ObjectId[];
  answers: Answer[] | ObjectId[];
  questions: Question[] | ObjectId[];
  friends: string[];
  requests: string[];
  privacySettings?: {
    username?: boolean;
    email?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    biography?: boolean;
    leaderboard?: boolean;
  };
  notifications: UserNotification[] | ObjectId[];
  chats: Chat[] | ObjectId[];
  settings: {
    colorMode: String,
    fontSize: String,
    isBlackAndWhite: Boolean,
  },
}

/**
 * Type representing the possible responses for a user-related operation.
 */
export type UserResponse = User | { error: string };

export interface UserRequest extends Request {
  body: User;
}

/**
 * Interface representing a message.
 */
export interface Message {
  _id?: ObjectId;
  sender: string;
  chatId: string;
  message: string;
  createdAt: Date;
}

export interface Chat {
  _id?: ObjectId;
  participants: string[];
  createdAt: Date;
  // messages: Message[] | ObjectId[];
}

/**
 * Interface representing the request query to find an answer by the author.
 */
export interface AnswerByAuthorRequest extends Request {
  query: {
    ansBy: string;
  };
}

/**
 * Interface representing the request query to find a user by their username.
 */
export interface FindUserRequest extends Request {
  query: {
    username: string;
  };
}

/**
 * Interface representing the request query to find a comment by the author.
 */
export interface CommentByAuthorRequest extends Request {
  query: {
    commentBy: string;
  };
}

/**
 * Interface representing a notification a user can receive.
 * - sender: The username of the user who sent the notification.
 * - type: The type of notification, either 'question', 'answer', 'comment', or 'request'.
 * - content: The content of the notification.
 * - isRead: Whether the user has read the notification.
 * - createdAt: The date and time when the notification was created.
 */
export interface UserNotification {
  _id?: ObjectId;
  sender: string;
  recipient: string;
  content: string;
  type: 'question' | 'request';
  questionId?: string;
  isRead: boolean;
  createdAt: Date;
}
