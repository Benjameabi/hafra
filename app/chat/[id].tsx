import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import MessageBubble from '@/components/MessageBubble';
import { useAuthStore } from '@/store/auth-store';
import { useMessagesStore } from '@/store/messages-store';
import { users } from '@/mocks/users';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    messages, 
    fetchMessages, 
    sendMessage, 
    isLoading 
  } = useMessagesStore();
  
  const [messageText, setMessageText] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  
  const flatListRef = useRef<FlatList>(null);
  
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
    
    if (id) {
      // If id is a conversation id, fetch messages
      fetchMessages(id as string);
      
      // Find the other user in the conversation
      const otherUserId = id;
      const foundUser = users.find(u => u.id === otherUserId);
      
      if (foundUser) {
        setOtherUser(foundUser);
      }
    }
  }, [id, user, router]);
  
  const handleSend = async () => {
    if (!messageText.trim() || !user || !otherUser) return;
    
    await sendMessage({
      senderId: user.id,
      receiverId: otherUser.id,
      content: messageText.trim(),
      conversationId: id as string,
      type: 'text'
    });
    
    setMessageText('');
  };
  
  if (!user || !otherUser) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={otherUser.name} 
        showBackButton={true}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isCurrentUser={item.senderId === user.id}
              />
            )}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.text.light}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={Colors.text.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  messagesContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.primary + '80',
  },
});