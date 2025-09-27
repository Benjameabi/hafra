import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { 
  signUpWithEmailAndPassword, 
  signInWithEmailAndPassword_,
  signOutUser,
  getCurrentUserProfile,
  UserProfile 
} from '@/services/firebase/auth';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const userProfile = await signInWithEmailAndPassword_(email, password);
          set({ user: userProfile, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Invalid email or password", 
            isLoading: false 
          });
        }
      },
      
      signUp: async (email: string, name: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const userProfile = await signUpWithEmailAndPassword(email, name, password);
          set({ user: userProfile, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An error occurred during sign up", 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          await signOutUser();
          set({ user: null, error: null });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Error signing out" });
        }
      },
      
      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        const maxRetries = 5;
        let retryCount = 0;
        
        const attemptInitialization = () => {
          try {
            console.log('Attempting to initialize Firebase Auth...');
            
            // Get Firebase Auth instance (this will initialize it if needed)
            const authInstance = auth();
            
            console.log('Setting up Firebase Auth state listener...');
            
            // Listen for auth state changes
            const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
              console.log('Auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');
              
              if (firebaseUser) {
                // User is signed in, get their profile
                try {
                  const userProfile = await getCurrentUserProfile();
                  set({ user: userProfile, isInitialized: true, error: null });
                } catch (error) {
                  console.error('Error getting user profile:', error);
                  set({ user: null, isInitialized: true, error: 'Failed to load user profile' });
                }
              } else {
                // User is signed out
                set({ user: null, isInitialized: true, error: null });
              }
            });
            
            // Store unsubscribe function for cleanup
            console.log('Firebase Auth initialized successfully');
            
          } catch (error) {
            console.error('Error initializing auth:', error);
            retryCount++;
            
            if (retryCount < maxRetries) {
              console.log(`Retrying auth initialization... (${retryCount}/${maxRetries})`);
              setTimeout(attemptInitialization, 2000 * retryCount);
            } else {
              console.error('Firebase Auth initialization failed after maximum retries');
              set({ isInitialized: true, error: 'Firebase Auth initialization failed' });
            }
          }
        };
        
        attemptInitialization();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user data, not auth state listeners
      partialize: (state) => ({ user: state.user }),
    }
  )
);