
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { getCurrentUser } from '@/app/actions/auth';


interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onIdTokenChanged is the recommended way to listen for auth state changes.
    // It runs on the client and is triggered by login, logout, or token refresh.
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // If Firebase says a user is logged in, we trust that and fetch their
        // full profile from Firestore to get custom fields like 'role' and 'name'.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
        } else {
            console.warn("User authenticated with Firebase but not found in Firestore.", firebaseUser.uid);
            // This can happen if the Firestore document creation failed during signup.
            // We'll treat them as logged out to be safe.
            setCurrentUser(null);
        }
      } else {
        // User is signed out.
        setCurrentUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
