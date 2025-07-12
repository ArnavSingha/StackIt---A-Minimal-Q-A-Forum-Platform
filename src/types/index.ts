export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
};

export type Tag = {
  id: string;
  name: string;
  questionCount?: number;
};

export type Answer = {
  id: string;
  authorId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: Date;
  questionId: string;
};

export type AnswerWithAuthor = Omit<Answer, 'authorId'> & {
    author: User;
}

export type Question = {
  id:string;
  title: string;
  description: string;
  authorId: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  views: number;
  createdAt: Date;
  answerCount: number;
};

export type QuestionWithAuthor = Omit<Question, 'authorId'> & {
    author: User;
    answers: AnswerWithAuthor[];
}

export type Notification = {
  id: string;
  text: string;
  read: boolean;
  createdAt: Date;
};
