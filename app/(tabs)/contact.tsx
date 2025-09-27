import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { createContactMessage } from '@/services/firebase/contact';

export default function ContactScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    // Validate form
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save contact message to Firebase
      const contactMessage = await createContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        userId: user?.id // Include user ID if logged in
      });

      console.log('✅ Contact message saved to Firebase:', contactMessage);
      
      // Reset form
      if (!user) {
        setName('');
        setEmail('');
      }
      setSubject('');
      setMessage('');
      
      console.log('🔔 Showing success alert...');
      
      // Show success message and redirect to home
      Alert.alert(
        t('contact.messageSent'),
        t('contact.messageSentSuccess'),
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('🏠 Navigating to home page...');
              // Navigate to home page
              router.push('/');
            } 
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Failed to save contact message:', error);
      Alert.alert(
        'Error',
        'Failed to send message. Please try again.',
        [{ text: 'OK' }]
      );
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('contact.getInTouch')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('contact.getInTouchDescription')}
          </Text>
        </View>
        
        {/* Contact Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('contact.sendMessage')}</Text>
          
          <Input
            label={t('contact.name')}
            value={name}
            onChangeText={setName}
            placeholder={t('contact.name')}
            disabled={!!user}
          />
          
          <Input
            label={t('contact.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('contact.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={!!user}
          />
          
          <Input
            label={t('contact.subject')}
            value={subject}
            onChangeText={setSubject}
            placeholder={t('contact.subject')}
          />
          
          <Input
            label={t('contact.message')}
            value={message}
            onChangeText={setMessage}
            placeholder={t('contact.message')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            inputStyle={styles.messageInput}
          />
          
          <Button
            title={t('contact.sendMessageButton')}
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            style={styles.submitButton}
          />
        </View>
        
        {/* Contact Info */}
        <View style={styles.contactInfoSection}>
          <Text style={styles.sectionTitle}>{t('contact.contactInformation')}</Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>{t('contact.email')}</Text>
              <Text style={styles.contactValue}>contact@enriquediaz.com</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Phone size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>{t('contact.phone')}</Text>
              <Text style={styles.contactValue}>(555) 123-4567</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>{t('contact.location')}</Text>
              <Text style={styles.contactValue}>San Francisco, CA</Text>
            </View>
          </View>
        </View>
        
        {/* Business Hours */}
        <View style={styles.businessHoursSection}>
          <Text style={styles.sectionTitle}>{t('contact.businessHours')}</Text>
          
          <View style={styles.businessHoursItem}>
            <Text style={styles.businessHoursDay}>{t('contact.mondayFriday')}</Text>
            <Text style={styles.businessHoursTime}>9:00 - 18:00</Text>
          </View>
          
          <View style={styles.businessHoursItem}>
            <Text style={styles.businessHoursDay}>{t('contact.saturdaySunday')}</Text>
            <Text style={styles.businessHoursTime}>{t('contact.closed')}</Text>
          </View>
        </View>
        
        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>{t('contact.connectSocial')}</Text>
          
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Instagram size={24} color={Colors.text.primary} />
              <Text style={styles.socialButtonText}>{t('contact.instagram')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Twitter size={24} color={Colors.text.primary} />
              <Text style={styles.socialButtonText}>{t('contact.twitter')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Linkedin size={24} color={Colors.text.primary} />
              <Text style={styles.socialButtonText}>{t('contact.linkedin')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Chat CTA */}
        <View style={styles.chatCtaSection}>
          <Text style={styles.chatCtaTitle}>{t('contact.alreadyClient')}</Text>
          <Text style={styles.chatCtaDescription}>
            {t('contact.clientPortalDescription')}
          </Text>
          
          {user ? (
            <Button
              title={t('contact.goToMessages')}
              variant="outline"
              onPress={() => router.push('/chat')}
              fullWidth
            />
          ) : (
            <Button
              title={t('auth.login')}
              variant="outline"
              onPress={() => router.push('/(auth)/login')}
              fullWidth
            />
          )}
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('home.copyright')}</Text>
          <Text style={styles.footerLinks}>{t('home.privacyPolicy')} • {t('home.termsOfService')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  formSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  messageInput: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 8,
  },
  contactInfoSection: {
    padding: 24,
    backgroundColor: Colors.card,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  businessHoursSection: {
    padding: 24,
  },
  businessHoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  businessHoursDay: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  businessHoursTime: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  socialSection: {
    padding: 24,
    backgroundColor: Colors.card,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginTop: 8,
  },
  chatCtaSection: {
    margin: 24,
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatCtaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  chatCtaDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  footerLinks: {
    fontSize: 14,
    color: Colors.text.light,
  },
});