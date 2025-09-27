import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';
import Colors from '@/constants/colors';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export default function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const { content, timestamp } = message;
  
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {content}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginBottom: 12,
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
  },
  currentUserBubble: {
    backgroundColor: Colors.primary,
  },
  otherUserBubble: {
    backgroundColor: Colors.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: Colors.text.white,
  },
  otherUserText: {
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.light,
  },
});