import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Using Environment Variables for configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;

// Final validation: Ensure the app doesn't crash but logs a clear warning in the browser
if (!firebaseConfig.apiKey) {
  console.warn("Firebase configuration is missing! Ensure environment variables are set in your hosting platform (Netlify/Vercel).");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId || undefined);
export const storage = getStorage(app);
