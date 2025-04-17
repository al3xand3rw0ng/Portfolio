import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents>;

/**
 * Represents a user in the application.
 */
export interface User {
  picture: string;
  username: string;
  firstName: string;
  lastName: string;
  biography?: string;
  comments: Comment[];
  answers: Answer[];
  questions: Question[];
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
  notifications: UserNotification[];
  chats: Chat[];
  settings: {
    colorMode: string;
    fontSize: string;
    isBlackAndWhite: boolean;
  };
}

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  oldest: 'Oldest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
}

/**
 * Interface representing a notification object.
 * - _id - The unique identifier for the notification.
 * - sender - The username of the user who sent the notification.
 * - recipient - The username of the user who received the notification.
 * - content - The content of the notification.
 * - isRead - A boolean indicating whether the notification has been read.
 * - createdAt - The date and time when the notification was created.
 */
export interface UserNotification {
  _id?: string;
  sender: string;
  recipient: string;
  content: string;
  type: 'question' | 'request';
  questionId?: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Interface representing the payload for a message object.
 * - _id - The unique identifier for the message.
 * - sender - The username of the user who sent the message.
 * - chatId - The ID of the chat to which the message belongs.
 * - message - The content of the message.
 * - createdAt - The date and time when the message was created.
 */
export interface Message {
  _id?: string;
  sender: string;
  chatId: string;
  message: string;
  createdAt: Date;
}

/**
 * Interface representing the payload for a message update socket event.
 * - sender - The username of the user who sent the message.
 * - chatId - The ID of the chat to which the message belongs.
 * - message - The content of the message.
 * - createdAt - The date and time when the message was created.
 */
export interface MessageUpdatePayload {
  sender: string;
  chatId: string;
  message: string;
  createdAt: Date;
}

/**
 * Interface representing a chat object.
 * - _id - The unique identifier for the chat.
 * - participants - An array of usernames of the participants in the chat.
 * - createdAt - The date and time when the chat was created.
 */
export interface Chat {
  _id?: string;
  participants: string[];
  createdAt: Date;
}

/**
 * Interface representing the payload for a chat update socket event.
 * - participants - An array of usernames of the participants in the chat.
 * - createdAt - The date and time when the chat was created.
 */
export interface ChatUpdatePayload {
  participants: string[];
  createdAt: Date;
}

/**
 * Interface representing the payload for a vote update socket event.
 * - qid - The ID of the question being voted on.
 * - upVotes - An array of user IDs who upvoted the question.
 * - downVotes - An array of user IDs who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for a answer update socket event.
 * - qid - The ID of the question to which the answer was added.
 * - answer - The answer object containing the answer details.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

/**
 * Interface representing the payload for a comment update socket event.
 * - result - The updated question or answer object.
 * - type - The type of the object, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a friend request update socket event.
 * - requester - The username of the user who sent the friend request.
 * - recipient - The username of the user who received the friend request.
 * - status - The status of the friend request, either 'pending' or 'accepted'.
 */
export interface FriendRequestUpdatePayload {
  requester: string;
  recipient: string;
  status: 'pending' | 'accepted';
}

/**
 * Interface representing the payload for a friend list update socket event.
 * - username - The username of the user whose friend list was updated.
 * - friends - An array of usernames representing the updated friend list.
 */
export interface FriendListUpdatePayload {
  username: string;
  friends: string[];
}

/**
 * Interface representing the payload for a notification update socket event.
 * - sender - The username of the user who sent the notification.
 * - recipient - The username of the user who received the notification.
 * - content - The content of the notification.
 * - type - The type of the notification, either 'question' or 'request'.
 * - questionId - The ID of the question associated with the notification.
 * - createdAt - The date and time when the notification was created.
 */
export interface NotificationUpdatePayload {
  sender: string;
  recipient: string;
  content: string;
  type: 'question' | 'request';
  questionId?: string;
  createdAt: Date;
}

/**
 * Interface representing the payload for a read notification update socket event.
 * - nid - The ID of the notification that was read.
 */
export interface ReadNotificationUpdatePayload {
  nid: string;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 * - questionUpdate - Event emitted when a question is updated.
 * - answerUpdate - Event emitted when an answer is updated.
 * - viewsUpdate - Event emitted when the views of a question are updated.
 * - voteUpdate - Event emitted when the votes of a question are updated.
 * - commentUpdate - Event emitted when a comment is updated.
 * - friendRequestUpdate - Event emitted when a friend request is updated.
 * - friendListUpdate - Event emitted when a friend list is updated.
 * - notificationUpdate - Event emitted when a notification is updated.
 * - readNotificationUpdate - Event emitted when a notification is read.
 * - messageUpdate - Event emitted when a message is updated.
 * - chatUpdate - Event emitted when a chat is updated.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  friendRequestUpdate: (update: FriendRequestUpdatePayload) => void;
  friendListUpdate: (update: FriendListUpdatePayload) => void;
  notificationUpdate: (update: NotificationUpdatePayload) => void;
  readNotificationUpdate: (update: ReadNotificationUpdatePayload) => void;
  messageUpdate: (message: MessageUpdatePayload) => void;
  chatUpdate: (chat: ChatUpdatePayload) => void;
}
