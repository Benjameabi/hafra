import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: string; // Optional - if user is logged in
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

// Create a new contact message
export const createContactMessage = async (
  messageData: Omit<FirebaseContactMessage, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<FirebaseContactMessage> => {
  try {
    const messageRef = doc(collection(db, 'contact_messages'));
    const contactMessage: FirebaseContactMessage = {
      id: messageRef.id,
      ...messageData,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(messageRef, contactMessage);
    return contactMessage;
  } catch (error: any) {
    throw new Error(`Failed to create contact message: ${error.message}`);
  }
};

// Get all contact messages (for admin)
export const getAllContactMessages = async (): Promise<FirebaseContactMessage[]> => {
  try {
    const q = query(
      collection(db, 'contact_messages'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseContactMessage);
  } catch (error: any) {
    throw new Error(`Failed to get contact messages: ${error.message}`);
  }
};

// Get contact messages by status
export const getContactMessagesByStatus = async (
  status: FirebaseContactMessage['status']
): Promise<FirebaseContactMessage[]> => {
  try {
    const q = query(
      collection(db, 'contact_messages'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseContactMessage);
  } catch (error: any) {
    throw new Error(`Failed to get contact messages by status: ${error.message}`);
  }
}; 