// src/lib/firebase/index.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function initializeClientApp() {
    const firebaseConfig: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Validate that all required environment variables are present.
    // This is a more robust check to ensure all keys have a value.
    if (Object.values(firebaseConfig).some(value => !value)) {
        console.error("Firebase config is missing. Ensure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env file.");
        // We can throw an error here to halt execution if config is incomplete
        throw new Error("Firebase client configuration is incomplete. Check environment variables.");
    }

    return initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = !getApps().length ? initializeClientApp() : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
