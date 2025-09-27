import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { PodcastEpisode } from '@/types';
import Colors from '@/constants/colors';

interface PodcastCardProps {
  episode: PodcastEpisode;
  onPress: (episode: PodcastEpisode) => void;
}

export default function PodcastCard({ episode, onPress }: PodcastCardProps) {
  const { title, description, imageUrl, duration, publishedAt } = episode;
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(episode)}
      activeOpacity={0.9}
    >
      <Image
        source={imageUrl}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(publishedAt)}</Text>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{formatDuration(duration)}</Text>
            <View style={styles.playButton}>
              <Play size={14} color={Colors.text.white} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: Colors.text.light,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: Colors.text.light,
    marginRight: 8,
  },
  playButton: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});