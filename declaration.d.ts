// Only wrote the necessary types from the Spotify responses

interface ArtistObject {
  id: string;
  name: string;
}

interface NowPlayingTrack {
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: string;
  timestamp: number;
  item: {
    album: {
      album_type: string;
      id: string;
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
    };
    explicit: boolean;
    name: string;
    artists: Array<ArtistObject>;
    id: string;
    popularity: number;
  };
  is_playing: boolean;
  progress_ms: number;
}

interface TrackFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: string;
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
}

interface ArtistInfo {
  genres: Array<string>;
  popularity: number;
  followers: {
    total: number;
  };
}

interface AlbumInfo {
  popularity: number;
}
