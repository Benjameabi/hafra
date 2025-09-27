import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Play, Pause, SkipBack, SkipForward, Share2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Header from '@/components/Header';
import { podcastEpisodes } from '@/mocks/podcasts';
import { PodcastEpisode } from '@/types';

export default function PodcastDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (id) {
      const foundEpisode = podcastEpisodes.find(ep => ep.id === id);
      if (foundEpisode) {
        setEpisode(foundEpisode);
      } else {
        // Episode not found, go back
        router.back();
      }
    }
  }, [id, router]);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return newProgress;
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  if (!episode) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Loading..." />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title="Podcast Episode" 
        rightComponent={
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: episode.imageUrl }}
          style={[styles.image, { width }]}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{episode.title}</Text>
          <Text style={styles.date}>{formatDate(episode.publishedAt)}</Text>
          
          <View style={styles.playerContainer}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatDuration(Math.floor(episode.duration * progress / 100))}
              </Text>
              <Text style={styles.timeText}>
                {formatDuration(episode.duration)}
              </Text>
            </View>
            
            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controlButton}>
                <SkipBack size={24} color={Colors.text.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.playButton}
                onPress={togglePlayback}
              >
                {isPlaying ? (
                  <Pause size={24} color={Colors.text.white} />
                ) : (
                  <Play size={24} color={Colors.text.white} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                <SkipForward size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.descriptionTitle}>Episode Description</Text>
          <Text style={styles.description}>{episode.description}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.moreEpisodesTitle}>More Episodes</Text>
          
          {podcastEpisodes
            .filter(ep => ep.id !== episode.id)
            .slice(0, 3)
            .map(ep => (
              <TouchableOpacity 
                key={ep.id}
                style={styles.episodeItem}
                onPress={() => router.push(`/podcast/${ep.id}`)}
              >
                <Image
                  source={{ uri: ep.imageUrl }}
                  style={styles.episodeImage}
                  contentFit="cover"
                />
                <View style={styles.episodeContent}>
                  <Text style={styles.episodeTitle} numberOfLines={2}>
                    {ep.title}
                  </Text>
                  <Text style={styles.episodeDuration}>
                    {formatDuration(ep.duration)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/podcast')}
          >
            <Text style={styles.viewAllText}>View All Episodes</Text>
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
  shareButton: {
    padding: 8,
  },
  image: {
    height: 240,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: Colors.text.light,
    marginBottom: 24,
  },
  playerContainer: {
    marginBottom: 32,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    color: Colors.text.light,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 32,
  },
  moreEpisodesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  episodeItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  episodeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  episodeContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  episodeDuration: {
    fontSize: 14,
    color: Colors.text.light,
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});