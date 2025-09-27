import { User } from '@/types';

export const users: User[] = [
  {
    id: '1',
    email: 'admin@enriquediaz.com',
    name: 'Enrique Diaz',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    role: 'admin',
    language: 'en',
    subscriptionStatus: 'none',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    role: 'user',
    language: 'en',
    subscriptionStatus: 'active',
    createdAt: '2023-02-15T00:00:00.000Z',
  },
  {
    id: '3',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    role: 'user',
    language: 'en',
    subscriptionStatus: 'active',
    createdAt: '2023-03-10T00:00:00.000Z',
  },
  {
    id: '4',
    email: 'michael@example.com',
    name: 'Michael Chen',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    role: 'user',
    language: 'en',
    subscriptionStatus: 'none',
    createdAt: '2023-04-22T00:00:00.000Z',
  },
];