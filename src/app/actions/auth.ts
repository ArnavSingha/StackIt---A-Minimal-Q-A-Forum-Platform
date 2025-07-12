
'use server';

import { z } from 'zod';
import type { User } from '@/types';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { authAdmin, dbAdmin } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters long.'),
    email: z.string().email('Invalid email address.'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/\d/, 'Password must contain at least one digit.')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

async function setAuthCookie(user: import('firebase/auth').User) {
    if (!authAdmin) {
        throw new Error('Firebase Admin SDK is not initialized.');
    }
    const token = await user.getIdToken();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await authAdmin.createSessionCookie(token, { expiresIn });
    cookies().set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });
}

export async function loginAction(credentials: z.infer<typeof loginSchema>) {
  const validation = loginSchema.safeParse(credentials);
  if (!validation.success) {
    return { success: false, error: 'Invalid credentials format.' };
  }

  const { email, password } = validation.data;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await setAuthCookie(userCredential.user);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Invalid email or password.' };
  }
}

export async function signupAction(credentials: z.infer<typeof signupSchema>) {
  const validation = signupSchema.safeParse(credentials);
  if (!validation.success) {
    const firstError = validation.error.flatten().fieldErrors;
    const errorMessage = Object.values(firstError).flat()[0] || 'Invalid data provided.';
    return { success: false, error: errorMessage };
  }
   if (!dbAdmin) {
    return { success: false, error: 'Firestore is not initialized.' };
  }


  const { username, email, password } = validation.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const newUser: User = {
      id: userCredential.user.uid,
      name: username,
      email: email,
      avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`,
      role: 'user',
    };
    
    // Save user to Firestore
    await dbAdmin.collection('users').doc(newUser.id).set(newUser);

    await setAuthCookie(userCredential.user);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Could not create account.' };
  }
}


export async function logoutAction() {
    cookies().delete('session');
    await signOut(auth);
    revalidatePath('/');
}


export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie || !authAdmin || !dbAdmin) {
    return null;
  }

  try {
    const decodedToken = await authAdmin.verifySessionCookie(sessionCookie, true);
    if (!decodedToken) {
      return null;
    }
    const uid = decodedToken.uid;
    
    const userDoc = await dbAdmin.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return null;
    }

    return userDoc.data() as User;

  } catch (error) {
    console.error("Error verifying session cookie:", error);
    // Clear the invalid cookie
    cookies().delete('session');
    return null;
  }
}
