import { create } from 'zustand';
import { Message, Conversation } from '@/types';
import { messages as mockMessages, conversations as mockConversations } from '@/mocks/messages';

interface MessagesState {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  error: null,
  
  fetchConversations: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter conversations by userId
      const userConversations = mockConversations.filter(c => 
        c.participants.includes(userId)
      );
      
      set({ conversations: userConversations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch conversations", 
        isLoading: false 
      });
    }
  },
  
  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null, activeConversation: conversationId });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find conversation
      const conversation = mockConversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      // Get messages for this conversation
      const conversationMessages = mockMessages.filter(m => 
        conversation.participants.includes(m.senderId) && 
        m.receiverId && conversation.participants.includes(m.receiverId)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      set({ messages: conversationMessages, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch messages", 
        isLoading: false 
      });
    }
  },
  
  sendMessage: async (messageData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new message
      const newMessage: Message = {
        id: `message-${Date.now()}`,
        ...messageData,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Add message to the list
      set(state => ({ 
        messages: [...state.messages, newMessage],
        isLoading: false 
      }));
      
      // Update conversation or create a new one
      const { conversations } = get();
      const { activeConversation } = get();
      
      if (activeConversation) {
        // Update existing conversation
        set(state => ({
          conversations: state.conversations.map(c => 
            c.id === activeConversation 
              ? { ...c, lastMessage: newMessage, updatedAt: newMessage.timestamp }
              : c
          )
        }));
      } else {
        // Create new conversation
                  const newConversation: Conversation = {
            id: `conversation-${Date.now()}`,
            participants: [messageData.senderId, messageData.receiverId!],
            lastMessage: newMessage,
            unreadCount: 0,
            createdAt: newMessage.timestamp,
            updatedAt: newMessage.timestamp
          };
        
        set(state => ({
          conversations: [...state.conversations, newConversation],
          activeConversation: newConversation.id
        }));
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to send message", 
        isLoading: false 
      });
    }
  },
  
  markAsRead: async (messageIds) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        messages: state.messages.map(message => 
          messageIds.includes(message.id) ? { ...message, read: true } : message
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to mark messages as read", 
        isLoading: false 
      });
    }
  },
  
  setActiveConversation: (conversationId) => {
    set({ activeConversation: conversationId });
  }
}));