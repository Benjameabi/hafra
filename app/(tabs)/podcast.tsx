import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react-native';

import Colors from '@/constants/colors';
import PodcastCard from '@/components/PodcastCard';
import PodcastSeriesCard from '@/components/PodcastSeriesCard';
import Header from '@/components/Header';
import { podcastSeries, updatePodcastEpisodes, getEpisodesBySeriesId, podcastEpisodes } from '@/mocks/podcasts';
import { manualUpdateCheck } from '@/services/podcastUpdateService';

export default function PodcastScreen() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
    try {
      console.log('Manual refresh triggered');
      const result = await manualUpdateCheck();
      
      if (result.hasUpdates && result.newEpisodes) {
        updatePodcastEpisodes(result.newEpisodes);
        
        Alert.alert(
          'Episodes Updated!',
          'Your podcast episodes have been refreshed with the latest content from Spotify.',
          [{ text: 'Great!' }]
        );
      } else {
        Alert.alert(
          'Up to Date',
          'Your podcast episodes are already up to date with the latest content.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error during manual refresh:', error);
      Alert.alert(
        'Update Failed',
        'Unable to check for new episodes. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Get the latest episode across all series
  const getLatestEpisode = () => {
    return [...podcastEpisodes].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )[0];
  };

  const latestEpisode = getLatestEpisode();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={t('podcast.title')}
        rightComponent={
          <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
            <RefreshCw 
              size={20} 
              color={Colors.primary}
              style={refreshing ? { opacity: 0.5 } : {}}
            />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.description}>
            {t('podcast.description')}
          </Text>
          
                      <Text style={styles.lastUpdated}>
              Last updated: {new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </Text>

            {/* Latest Episode Section */}
            {latestEpisode && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('podcast.latestEpisode')}</Text>
                <PodcastCard
                  episode={latestEpisode}
                  onPress={() => router.push(`/podcast/episode/${latestEpisode.id}`)}
                />
              </View>
            )}

            {/* Podcast Series Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('podcast.podcastSeries')}</Text>
              <Text style={styles.sectionDescription}>
                Each series offers the latest 3 episodes with automatic updates.
              </Text>
            
                         {podcastSeries.map(series => {
               const seriesEpisodes = getEpisodesBySeriesId(series.id);
               return (
                 <PodcastSeriesCard
                   key={series.id}
                   series={series}
                   episodeCount={seriesEpisodes.length}
                   onPress={() => router.push(`/podcast/series/${series.id}`)}
                 />
               );
             })}
          </View>

          {/* Auto-update Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Episodes are automatically updated daily. The latest 3 episodes from each series are shown, with older episodes moving to Spotify when new ones are published.
            </Text>
          </View>
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
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});