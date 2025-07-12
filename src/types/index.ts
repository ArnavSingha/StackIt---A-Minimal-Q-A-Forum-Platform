
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
};

export type Answer = {
  id: string;
  author: User;
  content: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: Date;
};

export type Question = {
  id:string;
  title: string;
  description: string;
  author: User;
  tags: Tag[];
  answers: Answer[];
  upvotes: number;
  downvotes: number;
  views: number;
  createdAt: Date;
};

export type Notification = {
  id: string;
  text: string;
  read: boolean;
  createdAt: Date;
};
