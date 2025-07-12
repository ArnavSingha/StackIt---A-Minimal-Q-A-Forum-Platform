'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import type { User } from '@/types';
import { auth } from '@/lib/firebase';
import { authAdmin } from '@/lib/firebase/admin';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { users } from '@/lib/data'; // Import users from data

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

const COOKIE_NAME = 'firebase-auth-token';

export async function loginAction(credentials: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(credentials);
  if (!validation.success) {
    return { success: false, error: 'Invalid credentials format.' };
  }

  const { email, password } = validation.data;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return { success: true };

  } catch (error: any) {
    return { success: false, error: error.message || 'Invalid email or password.' };
  }
}

export async function signupAction(credentials: z.infer<typeof signupSchema>) {
  const validation = signupSchema.safeParse(credentials);
  if (!validation.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { username, email, password } = validation.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    // In a real app, you would save the username to a 'users' collection in Firestore
    // associated with the userCredential.user.uid
    const newUser: User = {
      id: userCredential.user.uid,
      name: username,
      email: email,
      avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`,
      role: 'user',
    };
    users.push(newUser);


    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Could not create account.' };
  }
}


export async function logoutAction() {
    cookies().delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;
    // In a real app, you'd fetch the user profile from Firestore/RTDB here
    const user = users.find(u => u.id === uid || u.email === decodedToken.email);
    return user || null;
  } catch (error) {
    // This often happens if the token is expired.
    // We clear the cookie to prevent login loops.
    cookies().delete(COOKIE_NAME);
    return null;
  }
}
