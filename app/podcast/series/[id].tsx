import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft, Share2, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';
import PodcastCard from '@/components/PodcastCard';
import { podcastSeries, podcastEpisodes } from '@/mocks/podcasts';
import { PodcastSeries, PodcastEpisode } from '@/types';

export default function PodcastSeriesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const [series, setSeries] = useState<PodcastSeries | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  
  useEffect(() => {
    if (id) {
      const foundSeries = podcastSeries.find(s => s.id === id);
      if (foundSeries) {
        setSeries(foundSeries);
        
        // Get episodes for this series
        const seriesEpisodes = podcastEpisodes.filter(ep => ep.seriesId === id);
        setEpisodes(seriesEpisodes);
      } else {
        // Series not found, go back
        router.back();
      }
    }
  }, [id, router]);
  
  const handleEpisodePress = (episodeId: string) => {
    router.push(`/podcast/episode/${episodeId}`);
  };
  
  const handleViewMoreEpisodes = async () => {
    if (series?.moreEpisodesUrl) {
      try {
        await Linking.openURL(series.moreEpisodesUrl);
      } catch (error) {
        console.error('Error opening Spotify URL:', error);
      }
    }
  };
  
  const remainingEpisodes = series ? (series.totalEpisodes || 0) - (series.displayedEpisodes || 0) : 0;
  
  if (!series) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={styles.rightPlaceholder} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{series.title}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={series.imageUrl}
          style={[styles.image, { width }]}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{series.category}</Text>
          </View>
          
          <Text style={styles.title}>{series.title}</Text>
          <Text style={styles.description}>{series.description}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.episodesTitle}>
            Episodes ({episodes.length}{series.totalEpisodes ? ` of ${series.totalEpisodes}` : ''})
          </Text>
          
          {episodes.length > 0 ? (
            <>
              {episodes.map(episode => (
                <PodcastCard
                  key={episode.id}
                  episode={episode}
                  onPress={() => handleEpisodePress(episode.id)}
                />
              ))}
              
              {remainingEpisodes > 0 && series.moreEpisodesUrl && (
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={handleViewMoreEpisodes}
                >
                  <View style={styles.viewMoreContent}>
                    <View>
                      <Text style={styles.viewMoreTitle}>
                        View {remainingEpisodes} more episodes
                      </Text>
                      <Text style={styles.viewMoreSubtitle}>
                        Listen on Spotify
                      </Text>
                    </View>
                    <ExternalLink size={20} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No episodes available yet</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.backToAllButton}
            onPress={() => router.push('/podcast')}
          >
            <Text style={styles.backToAllText}>Back to All Podcasts</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    padding: 8,
  },
  rightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    height: 240,
  },
  content: {
    padding: 24,
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
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 24,
  },
  episodesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  backToAllButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 24,
  },
  backToAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  viewMoreButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  viewMoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  viewMoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  viewMoreSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});