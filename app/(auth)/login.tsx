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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }
    
    await login(email, password);
    
    // If login successful, navigate to home
    if (!error) {
      router.replace('/');
    }
  };
  
  // Demo login
  const handleDemoLogin = async () => {
    await login('admin@enriquediaz.com', 'password');
    
    // If login successful, navigate to home
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to access your account and continue your coaching journey.
          </Text>
        </View>
        
        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
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
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
          
          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
          
          <Button
            title={t('auth.demoLogin')}
            variant="outline"
            onPress={handleDemoLogin}
            loading={isLoading}
            fullWidth
            style={styles.demoButton}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Button
            title={t('auth.continueWithGoogle')}
            variant="outline"
            onPress={() => Alert.alert('Info', 'Google login would be implemented here')}
            fullWidth
            style={styles.socialButton}
          />
          
          <Button
            title={t('auth.continueWithApple')}
            variant="outline"
            onPress={() => Alert.alert('Info', 'Apple login would be implemented here')}
            fullWidth
            style={styles.socialButton}
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.dontHaveAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupText}>{t('auth.signup')}</Text>
          </TouchableOpacity>
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
    marginBottom: 32,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.primary,
  },
  loginButton: {
    marginBottom: 12,
  },
  demoButton: {
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
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 4,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});