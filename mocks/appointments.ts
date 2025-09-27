import { Appointment } from '@/types';

export const appointments: Appointment[] = [
  {
    id: '1',
    userId: '2',
    serviceId: '2',
    title: 'Single Coaching Session',
    description: 'Focus on career transition strategies',
    startTime: '2025-06-25T14:00:00.000Z',
    endTime: '2025-06-25T15:00:00.000Z',
    date: '2025-06-25T14:00:00.000Z',
    status: 'confirmed',
    notes: 'Focus on career transition strategies',
    createdAt: '2025-06-20T10:00:00.000Z',
    updatedAt: '2025-06-20T10:00:00.000Z'
  },
  {
    id: '2',
    userId: '3',
    serviceId: '4',
    title: 'Monthly Coaching (Basic)',
    description: 'Monthly check-in, review goals from last session',
    startTime: '2025-06-26T10:00:00.000Z',
    endTime: '2025-06-26T11:00:00.000Z',
    date: '2025-06-26T10:00:00.000Z',
    status: 'confirmed',
    notes: 'Monthly check-in, review goals from last session',
    createdAt: '2025-06-21T09:00:00.000Z',
    updatedAt: '2025-06-21T09:00:00.000Z'
  },
  {
    id: '3',
    userId: '4',
    serviceId: '1',
    title: 'Discovery Call',
    description: 'Initial discovery call',
    startTime: '2025-06-24T16:30:00.000Z',
    endTime: '2025-06-24T17:00:00.000Z',
    date: '2025-06-24T16:30:00.000Z',
    status: 'completed',
    notes: 'Initial discovery call',
    createdAt: '2025-06-22T12:00:00.000Z',
    updatedAt: '2025-06-24T17:00:00.000Z'
  },
  {
    id: '4',
    userId: '2',
    serviceId: '2',
    title: 'Single Coaching Session',
    description: 'Follow-up on action items from previous session',
    startTime: '2025-07-02T15:00:00.000Z',
    endTime: '2025-07-02T16:00:00.000Z',
    date: '2025-07-02T15:00:00.000Z',
    status: 'pending',
    notes: 'Follow-up on action items from previous session',
    createdAt: '2025-06-23T11:00:00.000Z',
    updatedAt: '2025-06-23T11:00:00.000Z'
  },
  {
    id: '5',
    userId: '3',
    serviceId: '4',
    title: 'Monthly Coaching (Basic)',
    description: 'Regular monthly session',
    startTime: '2025-07-03T11:00:00.000Z',
    endTime: '2025-07-03T12:00:00.000Z',
    date: '2025-07-03T11:00:00.000Z',
    status: 'pending',
    createdAt: '2025-06-23T14:00:00.000Z',
    updatedAt: '2025-06-23T14:00:00.000Z'
  }
];