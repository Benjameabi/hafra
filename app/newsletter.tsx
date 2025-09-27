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
import { ArrowLeft, Mail, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

export default function NewsletterScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const handleSubscribe = async () => {
    // Validate email
    if (!email) {
      Alert.alert(t('common.error'), 'Please enter your email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubscribed(true);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        {!isSubscribed ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{t('newsletter.joinNewsletter')}</Text>
              <Text style={styles.subtitle}>
                {t('newsletter.newsletterDescription')}
              </Text>
            </View>
            
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Check size={16} color={Colors.accent} />
                </View>
                <Text style={styles.benefitText}>{t('newsletter.benefit1')}</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Check size={16} color={Colors.accent} />
                </View>
                <Text style={styles.benefitText}>{t('newsletter.benefit2')}</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Check size={16} color={Colors.accent} />
                </View>
                <Text style={styles.benefitText}>{t('newsletter.benefit3')}</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Check size={16} color={Colors.accent} />
                </View>
                <Text style={styles.benefitText}>{t('newsletter.benefit4')}</Text>
              </View>
            </View>
            
            <View style={styles.formContainer}>
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
              
              <Button
                title={t('newsletter.subscribeNow')}
                onPress={handleSubscribe}
                loading={isSubmitting}
                fullWidth
                style={styles.subscribeButton}
              />
              
              <Text style={styles.privacyText}>
                {t('newsletter.privacyNotice')}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <LinearGradient
              colors={[Colors.primary + '20', Colors.primary + '05']}
              style={styles.successGradient}
            />
            
            <View style={styles.successIconContainer}>
              <Mail size={40} color={Colors.primary} />
            </View>
            
            <Text style={styles.successTitle}>{t('newsletter.thankYou')}</Text>
            <Text style={styles.successMessage}>
              {t('newsletter.thankYouMessage')}
            </Text>
            
            <Button
              title={t('newsletter.returnHome')}
              variant="outline"
              onPress={() => router.push('/')}
              style={styles.returnButton}
            />
          </View>
        )}
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
  scrollViewContent: {
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  benefitsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  formContainer: {
    marginBottom: 24,
  },
  subscribeButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
    minHeight: 400,
  },
  successGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  returnButton: {
    minWidth: 200,
  },
});