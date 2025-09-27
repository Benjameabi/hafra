// services/podcastUpdateService.ts
import { podcastMetadata, shouldUpdatePodcasts } from '@/mocks/podcasts';
import { PodcastEpisode } from '@/types';

// Spotify Web API endpoints for each podcast
const SPOTIFY_API_ENDPOINTS = {
  'hombres-valientes': 'https://api.spotify.com/v1/shows/7awdaEr1ovXnQu4qFqxo4P/episodes',
  'man-i-fokus': 'https://api.spotify.com/v1/shows/6QEtTzOqllO2eQrKO07s6I/episodes',
  'frid-med-gud': 'https://api.spotify.com/v1/shows/09jMerowSyLPpy8Q10rD67/episodes'
};

// Spotify show IDs mapping
const SHOW_IDS = {
  'hombres-valientes': '7awdaEr1ovXnQu4qFqxo4P',
  'man-i-fokus': '6QEtTzOqllO2eQrKO07s6I',
  'frid-med-gud': '09jMerowSyLPpy8Q10rD67'
};

// Interface for Spotify episode data
interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  duration_ms: number;
  release_date: string;
  audio_preview_url: string | null;
}

interface SpotifyEpisodesResponse {
  items: SpotifyEpisode[];
  total: number;
  next: string | null;
}

// Function to get Spotify access token (client credentials flow)
const getSpotifyAccessToken = async (): Promise<string | null> => {
  try {
    // For demo purposes, we'll use a mock token
    // In production, you'd implement proper OAuth flow
    console.log('Getting Spotify access token...');
    
    // This would be your actual Spotify API call:
    /*
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
    */
    
    // For demo, return mock token
    return 'demo_access_token';
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return null;
  }
};

// Function to fetch latest episodes from Spotify for a specific show
const fetchLatestEpisodesFromSpotify = async (showId: string): Promise<SpotifyEpisode[]> => {
  try {
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      throw new Error('Could not get Spotify access token');
    }

    // For demo purposes, return mock data with realistic structure
    // In production, this would be an actual Spotify API call
    console.log(`Fetching episodes for show ${showId}...`);
    
    // Mock response based on actual Spotify API structure
    const mockEpisodes: SpotifyEpisode[] = generateMockEpisodes(showId);
    
    return mockEpisodes.slice(0, 3); // Return only latest 3
  } catch (error) {
    console.error(`Error fetching episodes for show ${showId}:`, error);
    return [];
  }
};

// Generate mock episodes that simulate real Spotify data
const generateMockEpisodes = (showId: string): SpotifyEpisode[] => {
  const baseData = {
    'hombres-valientes': {
      name: 'Hombres valientes',
      episodes: [
        { num: 62, title: 'La ciencia y tus metas!', desc: 'Después de tanta ciencia cuales son las conclusiones de lo que deberías hacer para alcanzar tus metas?' },
        { num: 61, title: 'Piensa bien!', desc: 'Uno de los secretos más grandes de todos los maestros importantes, es el entendimiento de la mente.' },
        { num: 60, title: 'Superar la pereza!', desc: 'Cómo vencer la pereza y la procrastinación para lograr tus objetivos más importantes.' }
      ]
    },
    'man-i-fokus': {
      name: 'Män i fokus!',
      episodes: [
        { num: 64, title: 'Forskning om målsättning!', desc: 'Vad säger vetenskapen om hur vi bäst når våra mål? De senaste rönen inom målsättningspsykologi.' },
        { num: 63, title: 'Mentalitet!', desc: 'Hur du utvecklar en vinnande mentalitet och övervinner mentala hinder på vägen mot framgång.' },
        { num: 62, title: 'Övervinna lättja!', desc: 'Praktiska strategier för att besegra prokrastination och hitta motivation för dina viktigaste mål.' }
      ]
    },
    'frid-med-gud': {
      name: 'Frid med Gud!',
      episodes: [
        { num: 25, title: 'Guds nåd i vardagen', desc: 'Hur vi kan uppleva och leva i Guds nåd mitt i vardagens utmaningar och glädjeämnen.' },
        { num: 24, title: 'Bön som förändrar', desc: 'Undervisning om böns kraft och hur vi kan utveckla ett djupare böneliv med Gud.' },
        { num: 23, title: 'Tillit i ovisshet', desc: 'Hur vi kan lita på Gud även när framtiden känns osäker och vägen är oklar.' }
      ]
    }
  };

  const seriesKey = Object.keys(SHOW_IDS).find(key => SHOW_IDS[key as keyof typeof SHOW_IDS] === showId) as keyof typeof baseData;
  const data = baseData[seriesKey];
  
  if (!data) return [];

  return data.episodes.map((ep, index) => ({
    id: `${showId}_${ep.num}`,
    name: `${ep.num}. ${ep.title}`,
    description: ep.desc,
    external_urls: {
      spotify: `https://open.spotify.com/episode/${showId}_${ep.num}`
    },
    images: [
      {
        url: `https://i.scdn.co/image/${showId}`,
        height: 640,
        width: 640
      }
    ],
    duration_ms: (800 + index * 100) * 1000, // Mock duration
    release_date: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    audio_preview_url: `https://p.scdn.co/mp3-preview/${showId}_${ep.num}` // Preview URL (usually 30 seconds)
  }));
};

// Convert Spotify episode to our internal format
const convertSpotifyEpisode = (spotifyEpisode: SpotifyEpisode, seriesId: string): PodcastEpisode => {
  return {
    id: `${seriesId}_${spotifyEpisode.id}`,
    seriesId: seriesId,
    title: spotifyEpisode.name,
    description: spotifyEpisode.description,
    audioUrl: spotifyEpisode.audio_preview_url || spotifyEpisode.external_urls.spotify,
    imageUrl: spotifyEpisode.images[0]?.url || '',
    duration: Math.floor(spotifyEpisode.duration_ms / 1000),
    publishedAt: new Date(spotifyEpisode.release_date).toISOString()
  };
};

// Function to fetch and update episodes for all series
export const fetchLatestEpisodes = async (): Promise<{ [seriesId: string]: PodcastEpisode[] }> => {
  try {
    const results: { [seriesId: string]: PodcastEpisode[] } = {};
    
    for (const [seriesId, showId] of Object.entries(SHOW_IDS)) {
      console.log(`Fetching latest episodes for ${seriesId}...`);
      
      const spotifyEpisodes = await fetchLatestEpisodesFromSpotify(showId);
      const convertedEpisodes = spotifyEpisodes.map(episode => 
        convertSpotifyEpisode(episode, seriesId)
      );
      
      results[seriesId] = convertedEpisodes;
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching latest episodes:', error);
    return {};
  }
};

// Function to check and update podcast data
export const checkForPodcastUpdates = async (): Promise<boolean> => {
  if (!shouldUpdatePodcasts()) {
    console.log('Podcast data is up to date');
    return false;
  }

  try {
    console.log('Checking for podcast updates...');
    
    const latestEpisodes = await fetchLatestEpisodes();
    
    if (Object.keys(latestEpisodes).length > 0) {
      console.log('New episodes found! Episodes would be updated in production.');
      // In production, you would update your episode storage here
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking for podcast updates:', error);
    return false;
  }
};

// Function to get the latest episode count from Spotify (placeholder)
export const getLatestEpisodeCounts = async (): Promise<Record<string, number>> => {
  try {
    const results: Record<string, number> = {};
    
    for (const [seriesId, showId] of Object.entries(SHOW_IDS)) {
      // In production, this would make an actual API call to get total episode count
      // For now, return mock counts
      const mockCounts = {
        'hombres-valientes': 62,
        'man-i-fokus': 64,
        'frid-med-gud': 25
      };
      
      results[seriesId] = mockCounts[seriesId as keyof typeof mockCounts] || 0;
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching latest episode counts:', error);
    return {};
  }
};

// Function to initialize automatic updates (call this when app starts)
export const initializePodcastUpdates = () => {
  // Check for updates immediately
  checkForPodcastUpdates();
  
  // Set up periodic checks every 24 hours
  const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  setInterval(() => {
    checkForPodcastUpdates();
  }, UPDATE_INTERVAL);
  
  console.log('Podcast update service initialized with automatic episode rotation');
};

// Function to manually trigger an update check
export const manualUpdateCheck = async (): Promise<{ hasUpdates: boolean; newCounts?: Record<string, number>; newEpisodes?: { [seriesId: string]: PodcastEpisode[] } }> => {
  try {
    const hasUpdates = await checkForPodcastUpdates();
    
    if (hasUpdates) {
      const newCounts = await getLatestEpisodeCounts();
      const newEpisodes = await fetchLatestEpisodes();
      return { hasUpdates: true, newCounts, newEpisodes };
    }
    
    return { hasUpdates: false };
  } catch (error) {
    console.error('Manual update check failed:', error);
    return { hasUpdates: false };
  }
};

export default {
  checkForPodcastUpdates,
  getLatestEpisodeCounts,
  initializePodcastUpdates,
  manualUpdateCheck,
  fetchLatestEpisodes
}; 