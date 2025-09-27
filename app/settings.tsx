import React from 'react';
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
import { Globe, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/auth-store';
import { languages } from '@/constants/languages';
import { useLanguageStore } from '@/store/language-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  
  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logoutConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('auth.logout'),
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };
  
  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={t('settings.settings')}
        showBackButton={true}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        {user ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/')}
            >
              <View style={styles.menuItemIcon}>
                <User size={20} color={Colors.primary} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{t('settings.profile')}</Text>
                <Text style={styles.menuItemDescription}>{t('settings.profileDescription')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('settings.notificationsTitle'), t('settings.notificationsDescription'))}
            >
              <View style={styles.menuItemIcon}>
                <Bell size={20} color={Colors.primary} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{t('settings.notifications')}</Text>
                <Text style={styles.menuItemDescription}>{t('settings.notificationsDescription')}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => Alert.alert(t('settings.privacyTitle'), t('settings.privacyDescription'))}
            >
              <View style={styles.menuItemIcon}>
                <Shield size={20} color={Colors.primary} />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{t('settings.privacy')}</Text>
                <Text style={styles.menuItemDescription}>{t('settings.privacyDescription')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
            
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.authButtonText}>{t('auth.login')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.authButton, styles.signupButton]}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={styles.signupButtonText}>{t('auth.signup')}</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          
          {languages.map(language => (
            <TouchableOpacity 
              key={language.code}
              style={[
                styles.languageItem,
                currentLanguage.code === language.code && styles.selectedLanguageItem
              ]}
              onPress={() => handleLanguageChange(language.code)}
            >
              <View style={styles.languageItemLeft}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNativeName}>{language.nativeName}</Text>
                </View>
              </View>
              
              {currentLanguage.code === language.code && (
                <View style={styles.selectedIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/contact')}
          >
            <View style={styles.menuItemIcon}>
              <HelpCircle size={20} color={Colors.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>{t('settings.helpCenter')}</Text>
              <Text style={styles.menuItemDescription}>{t('settings.helpCenterDescription')}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        {user && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('settings.version')} 1.0.0</Text>
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
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  authButton: {
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
  signupButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedLanguageItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  languageNativeName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.error + '10',
    borderRadius: 12,
    margin: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  footer: {
    padding: 24,
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