// Firebase Collections Structure
export const COLLECTIONS = {
  USERS: 'users',
  APPOINTMENTS: 'appointments',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  SERVICES: 'services',
  NEWSLETTERS: 'newsletters',
  PODCASTS: 'podcasts',
  PODCAST_EPISODES: 'podcast_episodes',
  TESTIMONIALS: 'testimonials'
} as const;

// Firestore Data Structure Documentation
/*
USERS Collection:
{
  id: string (document ID = Firebase Auth UID)
  name: string
  email: string
  role: 'user' | 'admin'
  subscriptionStatus: 'none' | 'basic' | 'premium'
  language: 'en' | 'es' | 'sv'
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

APPOINTMENTS Collection:
{
  id: string (auto-generated)
  userId: string (reference to user)
  serviceId: string
  title: string
  description: string
  startTime: string (ISO)
  endTime: string (ISO)
  date: string (ISO date)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

MESSAGES Collection:
{
  id: string (auto-generated)
  senderId: string (user ID)
  receiverId: string (user ID)
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: string (ISO)
  read: boolean
  conversationId: string
}

CONVERSATIONS Collection:
{
  id: string (format: userId1_userId2 - sorted alphabetically)
  participants: string[] (array of user IDs)
  lastMessage: string
  lastMessageTime: string (ISO)
  unreadCount: { [userId: string]: number }
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

SERVICES Collection:
{
  id: string (auto-generated)
  title: string
  description: string
  price: number (in USD)
  duration: string
  category: 'single' | 'subscription'
  features: string[]
  isActive: boolean
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

NEWSLETTERS Collection:
{
  id: string (auto-generated)
  email: string
  subscribedAt: string (ISO)
  isActive: boolean
}

PODCASTS Collection:
{
  id: string (auto-generated)
  title: string
  description: string
  imageUrl: string
  episodeCount: number
  isActive: boolean
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

PODCAST_EPISODES Collection:
{
  id: string (auto-generated)
  seriesId: string (reference to podcast)
  title: string
  description: string
  audioUrl: string
  duration: number (in seconds)
  publishedAt: string (ISO)
  isPublished: boolean
  createdAt: string (ISO)
  updatedAt: string (ISO)
}

TESTIMONIALS Collection:
{
  id: string (auto-generated)
  userId?: string (optional reference to user)
  name: string
  content: string
  rating: number (1-5)
  isPublished: boolean
  createdAt: string (ISO)
  updatedAt: string (ISO)
}
*/ 