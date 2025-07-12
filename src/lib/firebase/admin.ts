// src/lib/firebase/admin.ts
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Check if the app has already been initialized to prevent re-initialization.
const hasFirebaseAdminBeenInitialized = admin.apps.length > 0;

if (!hasFirebaseAdminBeenInitialized) {
  // Construct the service account object from environment variables.
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key needs to have its newlines escaped in the .env file.
    // We replace them back to actual newlines here.
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // Ensure all credentials are provided before attempting to initialize.
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    console.error('Firebase Admin SDK credentials are not set in .env. Skipping initialization.');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin SDK initialization failed:', error.message);
    }
  }
}

// Export the admin auth service, but only if initialization was successful.
// This provides a safe way to use the admin SDK elsewhere.
export const authAdmin = admin.apps.length > 0 ? admin.auth() : undefined;
export const dbAdmin = admin.apps.length > 0 ? getFirestore() : undefined;
