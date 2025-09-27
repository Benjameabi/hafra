import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { Testimonial } from '@/types';
import Colors from '@/constants/colors';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { name, role, content, rating, photoUrl } = testimonial;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
        )}
        
        <View style={styles.headerText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={16}
            color={index < rating ? Colors.secondary : Colors.border}
            fill={index < rating ? Colors.secondary : 'none'}
          />
        ))}
      </View>
      
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.text.white,
    fontSize: 20,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  role: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
});