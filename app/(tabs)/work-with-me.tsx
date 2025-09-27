import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, CreditCard, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/colors';
import ServiceCard from '@/components/ServiceCard';
import Button from '@/components/Button';
import { Service } from '@/types';
import { services } from '@/mocks/services';

export default function WorkWithMeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filter, setFilter] = useState<'all' | 'session' | 'subscription'>('all');
  
  const filteredServices = services.filter(service => 
    filter === 'all' || service.type === filter
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('services.workWithMe')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('services.workWithMeDescription')}
          </Text>
        </View>
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilterButton
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText
            ]}>
              {t('services.all')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              filter === 'session' && styles.activeFilterButton
            ]}
            onPress={() => setFilter('session')}
          >
            <Text style={[
              styles.filterText,
              filter === 'session' && styles.activeFilterText
            ]}>
              {t('services.singleSessions')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              filter === 'subscription' && styles.activeFilterButton
            ]}
            onPress={() => setFilter('subscription')}
          >
            <Text style={[
              styles.filterText,
              filter === 'subscription' && styles.activeFilterText
            ]}>
              {t('services.subscriptions')}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Services */}
        <View style={styles.servicesContainer}>
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={(service) => setSelectedService(service)}
              selected={selectedService?.id === service.id}
            />
          ))}
        </View>
        
        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>{t('services.howItWorks')}</Text>
          
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <Calendar size={24} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('services.step1Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('services.step1Description')}
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <Clock size={24} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('services.step2Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('services.step2Description')}
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <CreditCard size={24} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('services.step3Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('services.step3Description')}
              </Text>
            </View>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepIconContainer}>
              <Users size={24} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{t('services.step4Title')}</Text>
              <Text style={styles.stepDescription}>
                {t('services.step4Description')}
              </Text>
            </View>
          </View>
        </View>
        
        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>{t('services.faq')}</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              {t('services.faqQuestion1')}
            </Text>
            <Text style={styles.faqAnswer}>
              {t('services.faqAnswer1')}
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              {t('services.faqQuestion2')}
            </Text>
            <Text style={styles.faqAnswer}>
              {t('services.faqAnswer2')}
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              {t('services.faqQuestion3')}
            </Text>
            <Text style={styles.faqAnswer}>
              {t('services.faqAnswer3')}
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              {t('services.faqQuestion4')}
            </Text>
            <Text style={styles.faqAnswer}>
              {t('services.faqAnswer4')}
            </Text>
          </View>
        </View>
        
        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>{t('services.readyToTransform')}</Text>
          <Text style={styles.ctaDescription}>
            {t('services.readyToTransformDescription')}
          </Text>
          <Button 
            title={selectedService ? `${t('common.book')} ${selectedService.title}` : t('services.bookNow')}
            size="large"
            onPress={() => router.push({
              pathname: '/booking',
              params: { serviceId: selectedService?.id }
            })}
            fullWidth
          />
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
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeFilterText: {
    color: Colors.text.white,
  },
  servicesContainer: {
    padding: 16,
  },
  howItWorksSection: {
    padding: 24,
    backgroundColor: Colors.card,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  faqSection: {
    padding: 24,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  ctaSection: {
    margin: 24,
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
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