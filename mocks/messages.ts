import { Message, Conversation } from '@/types';

export const messages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: '2',
    receiverId: '1',
    content: "Hi Enrique, I've been thinking about what we discussed in our last session. I've started implementing those morning routines and already feel more focused.",
    timestamp: '2025-06-22T09:30:00.000Z',
    read: true,
    type: 'text'
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '1',
    receiverId: '2',
    content: "That's fantastic to hear, John! Consistency is key with these routines. How has your energy been throughout the day?",
    timestamp: '2025-06-22T10:15:00.000Z',
    read: true,
    type: 'text'
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '2',
    receiverId: '1',
    content: "Much better! I'm not hitting that afternoon slump anymore. I do have a question about the meditation practice though.",
    timestamp: '2025-06-22T14:20:00.000Z',
    read: true,
    type: 'text'
  },
  {
    id: '4',
    conversationId: '2',
    senderId: '3',
    receiverId: '1',
    content: "Hello Enrique, I wanted to check if we're still on for tomorrow's session? I've prepared the exercises you recommended.",
    timestamp: '2025-06-22T16:45:00.000Z',
    read: false,
    type: 'text'
  },
  {
    id: '5',
    conversationId: '2',
    senderId: '1',
    receiverId: '3',
    content: "Hi Sarah, yes we're confirmed for 10am tomorrow. Great job on completing those exercises! Looking forward to reviewing your progress.",
    timestamp: '2025-06-22T17:30:00.000Z',
    read: false,
    type: 'text'
  },
  {
    id: '6',
    conversationId: '3',
    senderId: '4',
    receiverId: '1',
    content: "Thank you for the discovery call today. I'm excited about the possibility of working together. Could you send me more information about the monthly coaching package?",
    timestamp: '2025-06-23T10:00:00.000Z',
    read: false,
    type: 'text'
  }
];

export const conversations: Conversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: messages[2],
    unreadCount: 0,
    createdAt: '2025-06-20T14:20:00.000Z',
    updatedAt: '2025-06-22T14:20:00.000Z'
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: messages[4],
    unreadCount: 1,
    createdAt: '2025-06-21T17:30:00.000Z',
    updatedAt: '2025-06-22T17:30:00.000Z'
  },
  {
    id: '3',
    participants: ['1', '4'],
    lastMessage: messages[5],
    unreadCount: 1,
    createdAt: '2025-06-23T09:00:00.000Z',
    updatedAt: '2025-06-23T10:00:00.000Z'
  }
];