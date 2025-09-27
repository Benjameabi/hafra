export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  photoUrl?: string;
  role: 'client' | 'coach' | 'admin' | 'user';
  language: string;
  timezone?: string;
  createdAt: string;
  subscriptionStatus?: 'none' | 'active' | 'expired';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  category: string;
  imageUrl?: string;
  features: string[];
  isPopular?: boolean;
  type?: 'session' | 'subscription';
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date?: string;
  datetime?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'confirmed' | 'pending';
  meetingLink?: string;
  notes?: string;
  price?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  photoUrl?: string;
  rating: number;
  comment: string;
  text?: string;
  content?: string;
  role?: string;
  serviceId?: string;
  createdAt: string;
  featured?: boolean;
}

export interface PodcastSeries {
  id: string;
  title: string;
  description: string;
  imageUrl: any; // Can be require() result or string URL
  totalEpisodes: number;
  displayedEpisodes: number;
  moreEpisodesUrl: string;
  language: string; // Language code (es, sv, en)
  category?: string;
}

export interface PodcastEpisode {
  id: string;
  seriesId: string;
  title: string;
  description: string;
  audioUrl: string; // URL to audio file or Spotify preview
  imageUrl: string; // Cover image URL
  duration: number; // Duration in seconds
  publishedAt: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error?: string;
  mode: 'audio' | 'demo' | 'spotify';
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  preferences?: {
    topics: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

export type NotificationType = 'appointment' | 'message' | 'reminder' | 'promotion';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  data?: any;
}