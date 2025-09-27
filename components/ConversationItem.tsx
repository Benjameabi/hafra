import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Conversation } from '@/types';
import { users } from '@/mocks/users';
import Colors from '@/constants/colors';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  onPress: (conversationId: string) => void;
}

export default function ConversationItem({ 
  conversation, 
  currentUserId,
  onPress 
}: ConversationItemProps) {
  const { id, participants, lastMessage, updatedAt } = conversation;
  
  // Get the other participant
  const otherParticipantId = participants.find(p => p !== currentUserId);
  const otherUser = users.find(u => u.id === otherParticipantId);
  
  if (!otherUser) return null;
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };
  
  // Check if there are unread messages
  const hasUnreadMessages = lastMessage && 
    lastMessage.receiverId === currentUserId && 
    !lastMessage.read;
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      {otherUser.photoUrl ? (
        <Image
          source={{ uri: otherUser.photoUrl }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>{otherUser.name.charAt(0)}</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{otherUser.name}</Text>
          <Text style={styles.time}>{formatTime(updatedAt)}</Text>
        </View>
        
        {lastMessage && (
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.message,
                hasUnreadMessages && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {lastMessage.senderId === currentUserId ? 'You: ' : ''}
              {lastMessage.content}
            </Text>
            
            {hasUnreadMessages && (
              <View style={styles.unreadBadge} />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text.white,
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  time: {
    fontSize: 12,
    color: Colors.text.light,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '500',
    color: Colors.text.primary,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
});