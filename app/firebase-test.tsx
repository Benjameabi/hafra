import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { createAppointment } from '@/services/firebase/appointments';
import { sendMessage } from '@/services/firebase/messages';
import { createContactMessage } from '@/services/firebase/contact';
import { useAuthStore } from '@/store/auth-store';

export default function FirebaseTestScreen() {
  const [isTestingAppointment, setIsTestingAppointment] = useState(false);
  const [isTestingMessage, setIsTestingMessage] = useState(false);
  const [isTestingContact, setIsTestingContact] = useState(false);
  const { user } = useAuthStore();

  const testAppointment = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setIsTestingAppointment(true);
    try {
      const appointment = await createAppointment({
        userId: user.id,
        serviceId: 'test-service',
        title: 'Test Appointment',
        description: 'This is a test appointment from Firebase test page',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        date: new Date().toISOString(),
        status: 'pending',
        notes: 'Test notes',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      Alert.alert('Success!', `Appointment created with ID: ${appointment.id}`);
      console.log('✅ Appointment created:', appointment);
    } catch (error: any) {
      Alert.alert('Error', `Failed to create appointment: ${error.message}`);
      console.error('❌ Appointment error:', error);
    }
    setIsTestingAppointment(false);
  };

  const testMessage = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setIsTestingMessage(true);
    try {
      const message = await sendMessage(
        user.id,
        'admin-user-id', // Admin user ID
        'Hello! This is a test message from Firebase test page.',
        'text'
      );

      Alert.alert('Success!', `Message sent with ID: ${message.id}`);
      console.log('✅ Message sent:', message);
    } catch (error: any) {
      Alert.alert('Error', `Failed to send message: ${error.message}`);
      console.error('❌ Message error:', error);
    }
    setIsTestingMessage(false);
  };

  const testContactMessage = async () => {
    setIsTestingContact(true);
    try {
      const contactMessage = await createContactMessage({
        name: user?.name || 'Test User',
        email: user?.email || 'test@example.com',
        subject: 'Test Contact Message',
        message: 'This is a test contact message from the Firebase test page.',
        userId: user?.id
      });

      Alert.alert('Success!', `Contact message sent with ID: ${contactMessage.id}`);
      console.log('✅ Contact message created:', contactMessage);
    } catch (error: any) {
      Alert.alert('Error', `Failed to send contact message: ${error.message}`);
      console.error('❌ Contact message error:', error);
    }
    setIsTestingContact(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Firebase Test" showBackButton />
      
      <View style={styles.content}>
        <Text style={styles.title}>Firebase Integration Test</Text>
        <Text style={styles.subtitle}>
          This page tests Firebase functionality directly
        </Text>

        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>Logged in as: {user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ) : (
          <Text style={styles.errorText}>Please log in first to test Firebase</Text>
        )}

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Appointments (Firestore)</Text>
          <Button
            title={isTestingAppointment ? "Creating..." : "Create Test Appointment"}
            onPress={testAppointment}
            disabled={!user || isTestingAppointment}
            fullWidth
          />
        </View>

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Messages (Firestore)</Text>
          <Button
            title={isTestingMessage ? "Sending..." : "Send Test Message"}
            onPress={testMessage}
            disabled={!user || isTestingMessage}
            fullWidth
          />
        </View>

        <View style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Contact Form (Firestore)</Text>
          <Button
            title={isTestingContact ? "Sending..." : "Send Test Contact Message"}
            onPress={testContactMessage}
            disabled={isTestingContact}
            fullWidth
          />
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            1. Make sure you're logged in{'\n'}
            2. Tap the test buttons above{'\n'}
            3. Check Firebase Console → Firestore Database{'\n'}
            4. Look for 'appointments', 'messages', and 'contact_messages' collections
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  userInfo: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 24,
  },
  testSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  instructions: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 8,
    marginTop: 'auto',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
}); 