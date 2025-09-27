// Firebase Services Exports
export * from './auth';
export * from './appointments';
export * from './messages';
export * from './collections';

// Firebase Initialization
export { auth, db, storage } from '@/config/firebase';

// Initialize Firebase Auth Listener
import { useAuthStore } from '@/store/auth-store';

// This should be called when the app starts
export const initializeFirebaseAuth = () => {
  const { initializeAuth } = useAuthStore.getState();
  initializeAuth();
}; 