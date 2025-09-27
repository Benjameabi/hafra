import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSignUp = async () => {
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'));
      return;
    }
    
    await signUp(email, name, password);
    
    // If signup successful, navigate to home
    if (!error) {
      router.replace('/');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>
            Sign up to start your coaching journey with Enrique Diaz.
          </Text>
        </View>
        
        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <Input
            label={t('auth.fullName')}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (error) clearError();
            }}
            placeholder={t('auth.fullName')}
          />
          
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) clearError();
            }}
            placeholder={t('auth.email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) clearError();
            }}
            placeholder={t('auth.password')}
            secureTextEntry
          />
          
          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (error) clearError();
            }}
            placeholder={t('auth.confirmPassword')}
            secureTextEntry
          />
          
          <Button
            title={t('auth.createAccount')}
            onPress={handleSignUp}
            loading={isLoading}
            fullWidth
            style={styles.signupButton}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Button
            title={t('auth.continueWithGoogle')}
            variant="outline"
            onPress={() => Alert.alert('Info', 'Google signup would be implemented here')}
            fullWidth
            style={styles.socialButton}
          />
          
          <Button
            title={t('auth.continueWithApple')}
            variant="outline"
            onPress={() => Alert.alert('Info', 'Apple signup would be implemented here')}
            fullWidth
            style={styles.socialButton}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.alreadyHaveAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginText}>{t('auth.login')}</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.termsText}>
          {t('auth.termsAgreement')}
        </Text>
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
  form: {
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: Colors.error + '15',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  signupButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.text.light,
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 4,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  termsText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
  },
});