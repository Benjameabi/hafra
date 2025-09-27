import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Award, BookOpen, Users, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/colors';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/mocks/testimonials';

export default function AboutScreen() {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' }}
          style={[styles.headerImage, { width }]}
          contentFit="cover"
        />
        
        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.aboutEnrique')}</Text>
          
          <Text style={styles.bio}>
            {t('about.bio')}
          </Text>
          
          <Text style={styles.bioDetail}>
            {t('about.bioDetail1')}
          </Text>
          
          <Text style={styles.bioDetail}>
            {t('about.bioDetail2')}
          </Text>
        </View>
        
        {/* Credentials */}
        <View style={styles.credentialsSection}>
          <Text style={styles.credentialsTitle}>{t('about.whyChooseMe')}</Text>
          
          <Text style={styles.bioDetail}>
            {t('about.empowerment')}
          </Text>
        </View>
        
        {/* Approach */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.helpWith')}</Text>
          
          <Text style={styles.approachText}>
            • {t('about.responsibilitySupport')}
          </Text>
          
          <Text style={styles.approachText}>
            • {t('about.improvedPerformance')}
          </Text>
          
          <Text style={styles.approachText}>
            • {t('about.personalDevelopment')}
          </Text>
          
          <Text style={styles.approachText}>
            • {t('about.workLifeBalance')}
          </Text>
        </View>
        
        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.clientTestimonials')}</Text>
          
          {testimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
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
  headerImage: {
    height: 300,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  bio: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 16,
    lineHeight: 28,
  },
  bioDetail: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  credentialsSection: {
    padding: 24,
    backgroundColor: Colors.card,
  },
  credentialsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  credential: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  credentialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  credentialContent: {
    flex: 1,
    justifyContent: 'center',
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  credentialDetail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  approachText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
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
});