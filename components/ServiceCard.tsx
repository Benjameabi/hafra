import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import { Service } from '@/types';
import Colors from '@/constants/colors';
import Button from './Button';
import { formatPrice } from '@/constants/currencies';
import { useLanguageStore } from '@/store/language-store';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
  selected?: boolean;
}

export default function ServiceCard({ service, onSelect, selected }: ServiceCardProps) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageStore();
  const { title, description, price, duration, type, features } = service;
  
  // Get translated service title and description
  const getTranslatedTitle = () => {
    const key = `serviceTypes.${title.toLowerCase().replace(/\s+/g, '')}`;
    const translated = t(key);
    return translated !== key ? translated : title;
  };
  
  const getTranslatedDescription = () => {
    const key = `serviceTypes.${title.toLowerCase().replace(/\s+/g, '')}Description`;
    const translated = t(key);
    return translated !== key ? translated : description;
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]}
      onPress={() => onSelect(service)}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{getTranslatedTitle()}</Text>
        {type === 'subscription' && (
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>{t('services.subscriptions')}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description}>{getTranslatedDescription()}</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {formatPrice(price, currentLanguage.code)}
          <Text style={styles.priceUnit}>
            {type === 'subscription' ? '/month' : ''}
          </Text>
        </Text>
        <Text style={styles.duration}>{duration} min</Text>
      </View>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Check size={16} color={Colors.accent} />
            <Text style={styles.featureText}>
              {t(`serviceFeatures.${feature}`, { defaultValue: feature })}
            </Text>
          </View>
        ))}
      </View>
      
      <Button
        title={price === 0 ? t('booking.confirmBooking') : t('common.select')}
        variant={selected ? "primary" : "outline"}
        onPress={() => onSelect(service)}
        fullWidth
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08', // Very light tint
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  subscriptionBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  duration: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
});