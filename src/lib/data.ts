
import type { User, Tag, Question, Answer } from '@/types';

// This is now a mock database for user profiles, not for authentication.
export const users: User[] = [
  { id: 'uid-alice', name: 'Alice', email: 'alice@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=A', role: 'user' },
  { id: 'uid-bob', name: 'Bob', email: 'bob@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=B', role: 'user' },
  { id: 'uid-charlie', name: 'Charlie', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/100x100.png?text=C', role: 'admin' },
];

const tags: Tag[] = [
  { id: 'tag-1', name: 'react' },
  { id: 'tag-2', name: 'typescript' },
  { id: 'tag-3', name: 'nextjs' },
  { id: 'tag-4', name: 'tailwind-css' },
  { id: 'tag-5', name: 'state-management' },
  { id: 'tag-6', name: 'genai' },
];

const answers: Answer[] = [
  {
    id: 'ans-1',
    author: users[1],
    content: '<p>You can use the <code>useState</code> hook combined with an <code>useEffect</code> to fetch data. Make sure to handle loading and error states.</p>',
    upvotes: 15,
    downvotes: 1,
    isAccepted: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'ans-2',
    author: users[2],
    content: '<p>For more complex scenarios, consider using a library like <code>SWR</code> or <code>React Query</code>. They handle caching, revalidation, and more, out of the box.</p><p>Here is a link: <a href="https://swr.vercel.app/" target="_blank" rel="noopener noreferrer">SWR</a></p>',
    upvotes: 8,
    downvotes: 0,
    isAccepted: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

const questions: Question[] = [
  {
    id: 'q-1',
    title: 'How to fetch data in React with Hooks?',
    description: '<p>I am new to React Hooks and I am trying to understand the best way to fetch data from an API. I have seen examples using <code>useEffect</code> and <code>useState</code>, but I am not sure if this is the best practice. What are the recommended ways to handle data fetching, including loading and error states?</p>',
    author: users[0],
    tags: [tags[0], tags[1], tags[4]],
    answers: answers,
    upvotes: 25,
    downvotes: 2,
    views: 150,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 'q-2',
    title: 'What is the best way to style a Next.js application in 2024?',
    description: '<h2>Styling Options</h2><p>I\'m starting a new Next.js project and I\'m wondering what the current best practices are for styling. I\'ve used Styled Components in the past, but I see a lot of people recommending Tailwind CSS.</p><ul><li>What are the pros and cons of Tailwind CSS vs. CSS-in-JS libraries?</li><li>Is server-side rendering for styles still a major concern?</li></ul>',
    author: users[1],
    tags: [tags[2], tags[3]],
    answers: [],
    upvotes: 18,
    downvotes: 0,
    views: 95,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
   {
    id: 'q-3',
    title: 'How to use GenAI for suggesting tags in a forum?',
    description: '<p>I want to build a feature that suggests relevant tags for a new question based on its title and description. What would be the best approach using Generative AI? Should I use a specific model or fine-tune one?</p>',
    author: users[2],
    tags: [tags[5], tags[2]],
    answers: [],
    upvotes: 30,
    downvotes: 1,
    views: 210,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export async function getQuestions(): Promise<Question[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return questions;
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return questions.find(q => q.id === id);
}

export async function getTags(): Promise<Tag[]> {
    // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return tags;
}

export async function getUsers(): Promise<User[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50));
  return users;
}
