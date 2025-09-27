import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface FirebaseMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
  conversationId: string;
}

export interface FirebaseConversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: { [userId: string]: number };
  createdAt: string;
  updatedAt: string;
}

// Create or get conversation between two users
export const getOrCreateConversation = async (
  userId1: string, 
  userId2: string
): Promise<string> => {
  try {
    // Create conversation ID (sorted to ensure consistency)
    const participants = [userId1, userId2].sort();
    const conversationId = participants.join('_');
    
    // Check if conversation already exists
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (!conversationDoc.exists()) {
      // Create new conversation
      const conversation: FirebaseConversation = {
        id: conversationId,
        participants,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: { [userId1]: 0, [userId2]: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(conversationRef, conversation);
    }
    
    return conversationId;
  } catch (error: any) {
    throw new Error(`Failed to get or create conversation: ${error.message}`);
  }
};

// Send a message
export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text'
): Promise<FirebaseMessage> => {
  try {
    const conversationId = await getOrCreateConversation(senderId, receiverId);
    
    // Add message to messages collection
    const messageRef = doc(collection(db, 'messages'));
    const message: FirebaseMessage = {
      id: messageRef.id,
      senderId,
      receiverId,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      conversationId
    };
    
    await setDoc(messageRef, message);
    
    // Update conversation with last message
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: content,
      lastMessageTime: message.timestamp,
      [`unreadCount.${receiverId}`]: increment(1),
      updatedAt: new Date().toISOString()
    });
    
    return message;
  } catch (error: any) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

// Get messages for a conversation
export const getMessages = async (conversationId: string): Promise<FirebaseMessage[]> => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseMessage);
  } catch (error: any) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }
};

// Get user conversations
export const getUserConversations = async (userId: string): Promise<FirebaseConversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as FirebaseConversation);
  } catch (error: any) {
    throw new Error(`Failed to get conversations: ${error.message}`);
  }
};

// Mark messages as read
export const markMessagesAsRead = async (
  conversationId: string, 
  userId: string
): Promise<void> => {
  try {
    // Update messages
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updatePromises);
    
    // Reset unread count in conversation
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0
    });
  } catch (error: any) {
    throw new Error(`Failed to mark messages as read: ${error.message}`);
  }
};

// Real-time message listener
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: FirebaseMessage[]) => void
) => {
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => doc.data() as FirebaseMessage);
    callback(messages);
  });
}; 