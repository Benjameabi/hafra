import { PodcastEpisode, PodcastSeries } from '@/types';

// Metadata for tracking updates and episode counts
export const podcastMetadata = {
  lastUpdated: Date.now(),
  episodeCounts: {
    'hombres-valientes': { 
      total: 62,
      displayed: 3,
      latest: [62, 61, 60] // Latest episode numbers currently shown
    },
    'man-i-fokus': { 
      total: 64,
      displayed: 3,
      latest: [64, 63, 62] // Latest episode numbers currently shown
    },
    'frid-med-gud': { 
      total: 25,
      displayed: 3,
      latest: [25, 24, 23] // Latest episode numbers currently shown
    }
  }
};

// Check if podcasts should be updated (every 24 hours)
export const shouldUpdatePodcasts = (): boolean => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return Date.now() - podcastMetadata.lastUpdated > TWENTY_FOUR_HOURS;
};

// Podcast series data
export const podcastSeries: PodcastSeries[] = [
  {
    id: 'hombres-valientes',
    title: 'Hombres valientes',
    description: 'Un podcast que te ayudará a desarrollar la mentalidad, herramientas y estrategias para convertirte en la mejor versión de ti mismo como hombre.',
    imageUrl: require('@/assets/images/man-i-fokus.jpg'),
    totalEpisodes: podcastMetadata.episodeCounts['hombres-valientes'].total,
    displayedEpisodes: podcastMetadata.episodeCounts['hombres-valientes'].displayed,
    moreEpisodesUrl: 'https://open.spotify.com/show/7awdaEr1ovXnQu4qFqxo4P',
    language: 'es'
  },
  {
    id: 'man-i-fokus',
    title: 'Män i fokus!',
    description: 'En podcast som hjälper dig att utveckla tankesättet, verktygen och strategierna för att bli den bästa versionen av dig själv som man.',
    imageUrl: require('@/assets/images/man-i-fokus.jpg'),
    totalEpisodes: podcastMetadata.episodeCounts['man-i-fokus'].total,
    displayedEpisodes: podcastMetadata.episodeCounts['man-i-fokus'].displayed,
    moreEpisodesUrl: 'https://open.spotify.com/show/6QEtTzOqllO2eQrKO07s6I',
    language: 'sv'
  },
  {
    id: 'frid-med-gud',
    title: 'Frid med Gud!',
    description: 'En kristen podcast som utforskar tro, hopp och kärlek i det dagliga livet. Upptäck djupare mening och frid genom Guds ord.',
    imageUrl: require('@/assets/images/frid-med-gud.jpg'),
    totalEpisodes: podcastMetadata.episodeCounts['frid-med-gud'].total,
    displayedEpisodes: podcastMetadata.episodeCounts['frid-med-gud'].displayed,
    moreEpisodesUrl: 'https://open.spotify.com/show/09jMerowSyLPpy8Q10rD67',
    language: 'sv'
  }
];

// Current episodes (these will be dynamically updated by the service)
export let podcastEpisodes: PodcastEpisode[] = [
  // Hombres valientes - Latest 3 episodes (62, 61, 60)
  {
    id: 'hombres-valientes_62',
    seriesId: 'hombres-valientes',
    title: '62. La ciencia y tus metas!',
    description: 'Después de tanta ciencia cuales son las conclusiones de lo que deberías hacer para alcanzar tus metas?',
    audioUrl: 'https://p.scdn.co/mp3-preview/hombres-valientes_62', // Spotify preview URL
    imageUrl: 'https://i.scdn.co/image/7awdaEr1ovXnQu4qFqxo4P',
    duration: 840, // seconds
    publishedAt: new Date().toISOString()
  },
  {
    id: 'hombres-valientes_61',
    seriesId: 'hombres-valientes',
    title: '61. Piensa bien!',
    description: 'Uno de los secretos más grandes de todos los maestros importantes, es el entendimiento de la mente.',
    audioUrl: 'https://p.scdn.co/mp3-preview/hombres-valientes_61',
    imageUrl: 'https://i.scdn.co/image/7awdaEr1ovXnQu4qFqxo4P',
    duration: 890,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'hombres-valientes_60',
    seriesId: 'hombres-valientes',
    title: '60. Superar la pereza!',
    description: 'Cómo vencer la pereza y la procrastinación para lograr tus objetivos más importantes.',
    audioUrl: 'https://p.scdn.co/mp3-preview/hombres-valientes_60',
    imageUrl: 'https://i.scdn.co/image/7awdaEr1ovXnQu4qFqxo4P',
    duration: 920,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Män i fokus - Latest 3 episodes (64, 63, 62)
  {
    id: 'man-i-fokus_64',
    seriesId: 'man-i-fokus',
    title: '64. Forskning om målsättning!',
    description: 'Vad säger vetenskapen om hur vi bäst når våra mål? De senaste rönen inom målsättningspsykologi.',
    audioUrl: 'https://p.scdn.co/mp3-preview/man-i-fokus_64',
    imageUrl: 'https://i.scdn.co/image/6QEtTzOqllO2eQrKO07s6I',
    duration: 800,
    publishedAt: new Date().toISOString()
  },
  {
    id: 'man-i-fokus_63',
    seriesId: 'man-i-fokus',
    title: '63. Mentalitet!',
    description: 'Hur du utvecklar en vinnande mentalitet och övervinner mentala hinder på vägen mot framgång.',
    audioUrl: 'https://p.scdn.co/mp3-preview/man-i-fokus_63',
    imageUrl: 'https://i.scdn.co/image/6QEtTzOqllO2eQrKO07s6I',
    duration: 930,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'man-i-fokus_62',
    seriesId: 'man-i-fokus',
    title: '62. Övervinna lättja!',
    description: 'Praktiska strategier för att besegra prokrastination och hitta motivation för dina viktigaste mål.',
    audioUrl: 'https://p.scdn.co/mp3-preview/man-i-fokus_62',
    imageUrl: 'https://i.scdn.co/image/6QEtTzOqllO2eQrKO07s6I',
    duration: 870,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },

  // Frid med Gud - Latest 3 episodes (25, 24, 23)
  {
    id: 'frid-med-gud_25',
    seriesId: 'frid-med-gud',
    title: '25. Guds nåd i vardagen',
    description: 'Hur vi kan uppleva och leva i Guds nåd mitt i vardagens utmaningar och glädjeämnen.',
    audioUrl: 'https://p.scdn.co/mp3-preview/frid-med-gud_25',
    imageUrl: 'https://i.scdn.co/image/09jMerowSyLPpy8Q10rD67',
    duration: 780,
    publishedAt: new Date().toISOString()
  },
  {
    id: 'frid-med-gud_24',
    seriesId: 'frid-med-gud',
    title: '24. Bön som förändrar',
    description: 'Undervisning om böns kraft och hur vi kan utveckla ett djupare böneliv med Gud.',
    audioUrl: 'https://p.scdn.co/mp3-preview/frid-med-gud_24',
    imageUrl: 'https://i.scdn.co/image/09jMerowSyLPpy8Q10rD67',
    duration: 820,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'frid-med-gud_23',
    seriesId: 'frid-med-gud',
    title: '23. Tillit i ovisshet',
    description: 'Hur vi kan lita på Gud även när framtiden känns osäker och vägen är oklar.',
    audioUrl: 'https://p.scdn.co/mp3-preview/frid-med-gud_23',
    imageUrl: 'https://i.scdn.co/image/09jMerowSyLPpy8Q10rD67',
    duration: 900,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Function to update episodes with fresh data from Spotify
export const updatePodcastEpisodes = (newEpisodes: { [seriesId: string]: PodcastEpisode[] }) => {
  const updatedEpisodes: PodcastEpisode[] = [];
  
  for (const [seriesId, episodes] of Object.entries(newEpisodes)) {
    updatedEpisodes.push(...episodes);
    
    // Update the latest episode numbers in metadata
    const episodeNumbers = episodes.map(ep => {
      const match = ep.title.match(/(\d+)\./);
      return match ? parseInt(match[1]) : 0;
    }).sort((a, b) => b - a); // Sort descending
    
    if (podcastMetadata.episodeCounts[seriesId as keyof typeof podcastMetadata.episodeCounts]) {
      podcastMetadata.episodeCounts[seriesId as keyof typeof podcastMetadata.episodeCounts].latest = episodeNumbers;
    }
  }
  
  // Replace the current episodes with new ones
  podcastEpisodes = updatedEpisodes;
  podcastMetadata.lastUpdated = Date.now();
  
  console.log('Podcast episodes updated with latest from Spotify');
};

// Function to get episodes by series ID
export const getEpisodesBySeriesId = (seriesId: string): PodcastEpisode[] => {
  return podcastEpisodes.filter(episode => episode.seriesId === seriesId);
};

// Function to get a specific episode by ID
export const getEpisodeById = (episodeId: string): PodcastEpisode | undefined => {
  return podcastEpisodes.find(episode => episode.id === episodeId);
};

// Function to get a specific series by ID
export const getSeriesById = (seriesId: string): PodcastSeries | undefined => {
  return podcastSeries.find(series => series.id === seriesId);
};

export default {
  podcastSeries,
  podcastEpisodes,
  podcastMetadata,
  shouldUpdatePodcasts,
  updatePodcastEpisodes,
  getEpisodesBySeriesId,
  getEpisodeById,
  getSeriesById
};