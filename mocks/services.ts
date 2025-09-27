import { Service } from '@/types';

export const services: Service[] = [
  {
    id: '1',
    title: 'Discovery Call',
    description: 'A 30-minute call to discuss your goals and see if we are a good fit for working together.',
    price: 0,
    currency: 'USD',
    duration: 15,
    category: 'consultation',
    type: 'session',
    features: ['goalAssessment', 'coachingOverview', 'personalizedRecommendations']
  },
  {
    id: '2',
    title: 'Single Coaching Session',
    description: 'One-on-one coaching session focused on your specific goals and challenges.',
    price: 50,
    currency: 'USD',
    duration: 30,
    category: 'coaching',
    type: 'session',
    features: ['inDepthDiscussion', 'actionableStrategies', 'followUpNotes', 'emailSupportOneWeek']
  },
  {
    id: '3',
    title: 'Intensive Breakthrough Session',
    description: 'An extended session designed to create significant breakthroughs in a specific area.',
    price: 100,
    currency: 'USD',
    duration: 60,
    category: 'coaching',
    type: 'session',
    features: ['deepDiveAnalysis', 'personalizedActionPlan', 'recordedSession', 'emailSupportTwoWeeks']
  },
  {
    id: '4',
    title: 'Monthly Coaching (Basic)',
    description: 'Ongoing support with regular sessions to help you achieve consistent progress.',
    price: 400,
    currency: 'USD',
    duration: 60,
    category: 'package',
    type: 'subscription',
    features: ['fourSessionsPerMonth', 'unlimitedEmailSupport', 'accessToResourcesLibrary', 'monthlyProgressReview']
  },
  {
    id: '5',
    title: 'Premium Transformation',
    description: 'Comprehensive coaching package for those committed to significant life changes.',
    price: 500,
    currency: 'USD',
    duration: 60,
    category: 'package',
    type: 'subscription',
    features: ['eightSessionsPerMonth', 'priorityScheduling', 'directMessagingAccess', 'customizedResources', 'weeklyProgressTracking']
  }
];