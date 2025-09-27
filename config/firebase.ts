import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBeWpJ7PkJyuZBiH8zuxtqv7idr5R6tWTQ",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "enrique-diaz-coaching-app.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "enrique-diaz-coaching-app",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "enrique-diaz-coaching-app.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "559004902011",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:559004902011:web:7b71972b3be6bb3c6078de",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q2JWBR8NR2"
};

// Initialize Firebase app
let app: FirebaseApp;
let authInstance: Auth | null = null;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize other services immediately (these don't cause issues)
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('Firebase app and services initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Function to get or initialize auth instance
const getFirebaseAuth = (): Auth => {
  if (!authInstance) {
    try {
      authInstance = getAuth(app);
      console.log('Firebase Auth initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Auth:', error);
      throw error;
    }
  }
  return authInstance;
};

// Export Firebase services
export { getFirebaseAuth as auth, db, storage };

export default app; 