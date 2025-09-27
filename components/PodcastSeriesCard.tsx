import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Headphones, ExternalLink } from 'lucide-react-native';
import { PodcastSeries } from '@/types';
import Colors from '@/constants/colors';

interface PodcastSeriesCardProps {
  series: PodcastSeries;
  episodeCount: number;
  onPress: (series: PodcastSeries) => void;
}

export default function PodcastSeriesCard({ series, episodeCount, onPress }: PodcastSeriesCardProps) {
  const { title, description, imageUrl, moreEpisodesUrl, totalEpisodes, displayedEpisodes, language } = series;
  
  const handleViewMoreEpisodes = async () => {
    if (moreEpisodesUrl) {
      try {
        await Linking.openURL(moreEpisodesUrl);
      } catch (error) {
        console.error('Error opening Spotify URL:', error);
      }
    }
  };

  const remainingEpisodes = totalEpisodes && displayedEpisodes ? totalEpisodes - displayedEpisodes : 0;
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(series)}
      activeOpacity={0.9}
    >
      <Image
        source={imageUrl}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{language.toUpperCase()}</Text>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.episodeCountContainer}>
            <Headphones size={16} color={Colors.primary} />
            <Text style={styles.episodeCount}>
              {episodeCount} {episodeCount === 1 ? 'episode' : 'episodes'}
              {totalEpisodes && ` of ${totalEpisodes}`}
            </Text>
          </View>
          
          {remainingEpisodes > 0 && moreEpisodesUrl && (
            <TouchableOpacity 
              style={styles.moreEpisodesButton}
              onPress={handleViewMoreEpisodes}
            >
              <Text style={styles.moreEpisodesText}>
                +{remainingEpisodes} more
              </Text>
              <ExternalLink size={14} color={Colors.primary} />
            </TouchableOpacity>
          )}
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
    height: 160,
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
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
  episodeCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeCount: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  moreEpisodesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreEpisodesText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 6,
  },
});