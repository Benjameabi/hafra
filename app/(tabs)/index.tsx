import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Users, TrendingUp, Heart, Scale, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import LanguageSelector from '@/components/LanguageSelector';
import Logo from '@/components/Logo';
import { services } from '@/mocks/services';
import { testimonials } from '@/mocks/testimonials';
import { useAuthStore } from '@/store/auth-store';

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  const featuredServices = services.slice(0, 2);
  const featuredTestimonials = testimonials.slice(0, 2);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroContainer, { height: height * 0.85 }]}>
          <Image
            source={require('@/assets/images/Enrique Diaz- Life Coach.png')}
            style={[styles.heroImage, { width, height: height * 0.85 }]}
            contentFit="cover"
          />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
            style={[styles.heroOverlay, { width, height: height * 0.85 }]}
          />
          
          <SafeAreaView style={styles.heroContent} edges={['top']}>
            <View style={styles.logoContainer}>
              <Logo size="medium" color="#FFFFFF" useImage={true} />
              <View style={styles.topRightContainer}>
                <LanguageSelector variant="minimal" />
                {!user && (
                  <View style={styles.authButtons}>
                    <TouchableOpacity 
                      style={styles.loginButton}
                      onPress={() => router.push('/(auth)/login')}
                    >
                      <Text style={styles.loginButtonText}>{t('auth.login')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.signupButton}
                      onPress={() => router.push('/(auth)/signup')}
                    >
                      <Text style={styles.signupButtonText}>{t('auth.signup')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {user && (
                  <View style={styles.userInfo}>
                    <Text style={styles.welcomeText}>{t('common.welcome')}, {user.name}!</Text>
                                         <TouchableOpacity 
                       style={styles.logoutButton}
                       onPress={() => useAuthStore.getState().logout()}
                     >
                       <Text style={styles.logoutButtonText}>{t('auth.logout')}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                       style={styles.testButton}
                       onPress={() => router.push('/firebase-test')}
                     >
                       <Text style={styles.testButtonText}>Firebase Test</Text>
                     </TouchableOpacity>
                   </View>
                 )}
               </View>
            </View>
            
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>{t('home.startJourney')}</Text>
              <Text style={styles.heroDescription}>
                {t('home.journeyDescription')}
              </Text>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push('/booking')}
              >
                <View style={styles.ctaInner}>
                  <ArrowRight size={24} color="#fff" />
                </View>
                <Text style={styles.ctaText}>{t('home.getStarted')}</Text>
                <View style={styles.chevrons}>
                  <ChevronRight size={16} color={Colors.text.primary} style={styles.chevron} />
                  <ChevronRight size={16} color={Colors.text.primary} style={styles.chevron} />
                  <ChevronRight size={16} color={Colors.text.primary} style={styles.chevron} />
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
        
        {/* Services Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.services')}</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/work-with-me')}
            >
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {featuredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={() => router.push('/booking')}
            />
          ))}
        </View>
        
        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresSectionTitle}>{t('home.howICanHelp')}</Text>
          
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Users size={24} color={Colors.primary} />
              </View>
              <Text style={styles.featureTitle}>{t('home.responsibilitySupport')}</Text>
              <Text style={styles.featureDescription}>
                {t('home.responsibilitySupportDescription')}
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <TrendingUp size={24} color={Colors.primary} />
              </View>
              <Text style={styles.featureTitle}>{t('home.improvedPerformance')}</Text>
              <Text style={styles.featureDescription}>
                {t('home.improvedPerformanceDescription')}
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Heart size={24} color={Colors.primary} />
              </View>
              <Text style={styles.featureTitle}>{t('home.personalDevelopment')}</Text>
              <Text style={styles.featureDescription}>
                {t('home.personalDevelopmentDescription')}
              </Text>
            </View>
            
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Scale size={24} color={Colors.primary} />
              </View>
              <Text style={styles.featureTitle}>{t('home.workLifeBalance')}</Text>
              <Text style={styles.featureDescription}>
                {t('home.workLifeBalanceDescription')}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Testimonials */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.testimonials')}</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/about')}
            >
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              <ArrowRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          {featuredTestimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </View>
        
        {/* Newsletter Signup */}
        <View style={styles.newsletterSection}>
          <LinearGradient
            colors={[Colors.primary, Colors.primary + 'CC']}
            style={styles.newsletterGradient}
          />
          <View style={styles.newsletterContent}>
            <Text style={styles.newsletterTitle}>{t('home.joinNewsletter')}</Text>
            <Text style={styles.newsletterDescription}>
              {t('home.newsletterDescription')}
            </Text>
            <Button 
              title={t('home.subscribeNow')}
              variant="secondary"
              onPress={() => router.push('/newsletter')}
              size="large"
              fullWidth
            />
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('home.copyright')}</Text>
          <Text style={styles.footerLinks}>{t('home.privacyPolicy')} • {t('home.termsOfService')}</Text>
        </View>
      </ScrollView>
    </View>
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
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 0,
    paddingRight: 24,
    width: '100%',
  },
  heroTextContainer: {
    marginBottom: 60,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 48,
  },
  heroDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  ctaInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 8,
  },
  chevrons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: -8,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 4,
  },
  featuresSection: {
    padding: 24,
    backgroundColor: Colors.card,
  },
  featuresSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  newsletterSection: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  newsletterGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  newsletterContent: {
    padding: 24,
    justifyContent: 'center',
    height: '100%',
  },
  newsletterTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.white,
    marginBottom: 12,
  },
  newsletterDescription: {
    fontSize: 16,
    color: Colors.text.white,
    marginBottom: 24,
    lineHeight: 24,
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
  topRightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.accent,
  },
  signupButtonText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  userInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});