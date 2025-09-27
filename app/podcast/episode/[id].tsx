import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Play, Pause, SkipBack, SkipForward, Share2, ArrowLeft } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Colors from '@/constants/colors';
import { getEpisodeById, getSeriesById, getEpisodesBySeriesId } from '@/mocks/podcasts';
import { PodcastEpisode, PodcastSeries, AudioPlayerState } from '@/types';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

export default function PodcastEpisodeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [series, setSeries] = useState<PodcastSeries | null>(null);
  const [relatedEpisodes, setRelatedEpisodes] = useState<PodcastEpisode[]>([]);
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: undefined,
    mode: 'audio'
  });
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundEpisode = getEpisodeById(id as string);
      if (foundEpisode) {
        setEpisode(foundEpisode);
        
        // Find the series this episode belongs to
        const foundSeries = getSeriesById(foundEpisode.seriesId);
        if (foundSeries) {
          setSeries(foundSeries);
          
          // Get related episodes from the same series
          const allSeriesEpisodes = getEpisodesBySeriesId(foundSeries.id);
          const related = allSeriesEpisodes
            .filter(ep => ep.id !== id)
            .slice(0, 3);
          setRelatedEpisodes(related);
        }
      } else {
        // Episode not found, go back
        router.back();
      }
    }
  }, [id, router]);
  
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (playerState.isPlaying && playerState.mode === 'demo') {
      interval = setInterval(() => {
        setPlayerState(prev => {
          const newProgress = prev.currentTime + 0.5;
          if (newProgress >= 100) {
            return { ...prev, isPlaying: false, currentTime: 0 };
          }
          return { ...prev, currentTime: newProgress };
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playerState.isPlaying, playerState.mode]);
  
  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting up audio mode:', error);
    }
  };
  
  const loadAudio = async (): Promise<void> => {
    if (!episode) return;

    setPlayerState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // Check if audioUrl is a Spotify preview URL or if we should skip direct audio
      const audioUrl = episode.audioUrl;
      
      if (audioUrl.includes('p.scdn.co') || audioUrl.includes('spotify.com')) {
        // This is a Spotify URL - redirect to Spotify instead of trying to play
        console.log('Spotify URL detected, using redirect mode');
        setPlayerState(prev => ({ 
          ...prev, 
          isLoading: false, 
          mode: 'spotify',
          error: undefined
        }));
        return;
      } else {
        // Try to load as regular audio URL (for actual audio files)
        await loadRegularAudio(audioUrl);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Audio preview not available',
        mode: 'spotify'
      }));
    }
  };
  
  const loadSpotifyPreview = async (audioUrl: string): Promise<void> => {
    // This function is kept for potential future use with actual Spotify preview URLs
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false, isLooping: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: false, 
        mode: 'audio',
        duration: episode?.duration || 0
      }));

    } catch (error) {
      console.log('Spotify preview not available, falling back to Spotify redirect');
      throw error; // Re-throw to trigger fallback
    }
  };
  
  const loadRegularAudio = async (audioUrl: string): Promise<void> => {
    // Only attempt to load if it's actually an audio file URL
    if (!audioUrl.startsWith('http') || 
        audioUrl.includes('spotify.com') || 
        audioUrl.includes('p.scdn.co')) {
      throw new Error('Not a valid audio file URL');
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: false, isLooping: false },
      onPlaybackStatusUpdate
    );

    setSound(newSound);
    setPlayerState(prev => ({ 
      ...prev, 
      isLoading: false, 
      mode: 'audio',
      duration: episode?.duration || 0
    }));
  };
  
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        currentTime: status.positionMillis ? Math.floor(status.positionMillis / 1000) : 0,
        duration: status.durationMillis ? Math.floor(status.durationMillis / 1000) : (episode?.duration || 0),
        isLoading: false
      }));

      if (status.didJustFinish) {
        setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      }
    }
  };
  
  const togglePlayPause = async () => {
    if (!sound && playerState.mode === 'audio') {
      await loadAudio();
      return;
    }

    if (playerState.mode === 'spotify') {
      openSpotifyEpisode();
      return;
    }

    try {
      if (playerState.isPlaying) {
        await sound?.pauseAsync();
      } else {
        await sound?.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setPlayerState(prev => ({ ...prev, error: 'Playback error occurred' }));
    }
  };
  
  const openSpotifyEpisode = async () => {
    if (!episode) return;
    
    // Generate Spotify episode URL based on episode ID or use external URL
    const spotifyUrl = episode.audioUrl.includes('spotify.com') 
      ? episode.audioUrl 
      : `https://open.spotify.com/episode/${episode.id}`;
    
    try {
      const canOpen = await Linking.canOpenURL(spotifyUrl);
      if (canOpen) {
        await Linking.openURL(spotifyUrl);
      } else {
        Alert.alert(
          'Spotify Not Available',
          'Please install Spotify app to listen to this episode.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening Spotify:', error);
    }
  };
  
  const seekTo = async (position: number) => {
    if (sound && playerState.mode === 'audio') {
      try {
        await sound.setPositionAsync(position * 1000);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
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
  
  const getProgressPercentage = (): number => {
    if (playerState.duration === 0) return 0;
    return (playerState.currentTime / playerState.duration) * 100;
  };
  
  if (!episode || !series) {
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
      <Stack.Screen options={{ 
        title: series.title,
        headerBackTitle: 'Back'
      }} />
      
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
          source={episode.imageUrl}
          style={[styles.image, { width }]}
          contentFit="cover"
        />
        
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.seriesLink}
            onPress={() => router.push(`/podcast/series/${series.id}`)}
          >
            <Text style={styles.seriesText}>{series.title}</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{episode.title}</Text>
          <Text style={styles.date}>{formatDate(episode.publishedAt)}</Text>
          
          <View style={styles.playerContainer}>
            {playerState.mode === 'spotify' && (
              <View style={styles.spotifyNoticeContainer}>
                <MaterialIcons name="music-note" size={24} color={Colors.primary} />
                <View style={styles.spotifyNoticeContent}>
                  <Text style={styles.spotifyNoticeTitle}>Full Episode on Spotify</Text>
                  <Text style={styles.spotifyNoticeText}>
                    Tap the play button below to listen to the complete episode on Spotify
                  </Text>
                </View>
              </View>
            )}
            
            {playerState.mode === 'audio' && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[styles.progressBar, { width: `${getProgressPercentage()}%` }]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatDuration(playerState.currentTime)}</Text>
                  <Text style={styles.timeText}>{formatDuration(playerState.duration)}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={[
                  styles.playButton,
                  playerState.mode === 'spotify' && styles.spotifyPlayButton
                ]}
                onPress={togglePlayPause}
                disabled={playerState.isLoading}
              >
                {playerState.isLoading ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <MaterialIcons
                    name={
                      playerState.mode === 'spotify' 
                        ? 'open-in-new'
                        : playerState.isPlaying 
                          ? 'pause' 
                          : 'play-arrow'
                    }
                    size={48}
                    color="white"
                  />
                )}
              </TouchableOpacity>

              {playerState.mode === 'spotify' && (
                <Text style={styles.spotifyHint}>
                  Listen on Spotify
                </Text>
              )}
            </View>
            
            <View style={styles.modeIndicator}>
              <Text style={styles.modeText}>
                {playerState.mode === 'audio' && 'Audio Preview'}
                {playerState.mode === 'spotify' && 'Full Episode on Spotify'}
                {playerState.mode === 'demo' && 'Demo Mode'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.descriptionTitle}>Episode Description</Text>
          <Text style={styles.description}>{episode.description}</Text>
          
          {relatedEpisodes.length > 0 && (
            <>
              <View style={styles.divider} />
              
              <Text style={styles.moreEpisodesTitle}>More from {series.title}</Text>
              
              {relatedEpisodes.map(ep => (
                <TouchableOpacity 
                  key={ep.id}
                  style={styles.episodeItem}
                  onPress={() => router.push(`/podcast/episode/${ep.id}`)}
                >
                  <Image
                    source={ep.imageUrl}
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
            </>
          )}
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push(`/podcast/series/${series.id}`)}
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
  seriesLink: {
    marginBottom: 8,
  },
  seriesText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
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
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: Colors.text.light,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotifyPlayButton: {
    backgroundColor: '#1DB954', // Spotify green
  },
  spotifyHint: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
  },
  modeIndicator: {
    alignItems: 'center',
  },
  modeText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  spotifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  spotifyButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  spotifyNoticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  spotifyNoticeContent: {
    flex: 1,
  },
  spotifyNoticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  spotifyNoticeText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
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