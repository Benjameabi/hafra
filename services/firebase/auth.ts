import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'none' | 'basic' | 'premium';
  createdAt: string;
  updatedAt: string;
}

// Sign up with email and password
export const signUpWithEmailAndPassword = async (
  email: string, 
  name: string, 
  password: string
): Promise<UserProfile> => {
  try {
    const authInstance = auth();
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;

    // Update user profile with name
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    const userProfile: UserProfile = {
      id: user.uid,
      name,
      email,
      role: 'user',
      subscriptionStatus: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return userProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signInWithEmailAndPassword_ = async (
  email: string, 
  password: string
): Promise<UserProfile> => {
  try {
    const authInstance = auth();
    
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    return userDoc.data() as UserProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    const authInstance = auth();
    await signOut(authInstance);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const authInstance = auth();
    const user = authInstance.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) return null;

    return userDoc.data() as UserProfile;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return null;
  }
}; 