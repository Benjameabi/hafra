import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import ConversationItem from '@/components/ConversationItem';
import { useAuthStore } from '@/store/auth-store';
import { useMessagesStore } from '@/store/messages-store';

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, fetchConversations, isLoading } = useMessagesStore();
  
  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in to access your messages',
        [
          { text: 'Cancel', onPress: () => router.back() },
          { text: 'Log In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }
    
    fetchConversations(user.id);
  }, [user, router]);
  
  const handleConversationPress = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Messages" showBackButton={true} />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              currentUserId={user.id}
              onPress={handleConversationPress}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MessageSquare size={40} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptyDescription}>
            Your conversations with Enrique will appear here.
          </Text>
          <TouchableOpacity 
            style={styles.newMessageButton}
            onPress={() => router.push('/contact')}
          >
            <Text style={styles.newMessageButtonText}>Send a Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  newMessageButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  newMessageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
});