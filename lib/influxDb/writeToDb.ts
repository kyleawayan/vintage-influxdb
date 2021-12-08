import { InfluxDB, Point } from "@influxdata/influxdb-client";
import config from "../../config.json";

const token = config.influxDbToken;
const org = config.influxDbOrg;
const bucket = config.influxDbBucket;

const client = new InfluxDB({
  url: config.influxDbUrl,
  token: token,
});

if (process.env.TS_NODE_DEV == "true") {
  console.warn("In development mode, not sending anything to InfluxDB.");
}

export default function writeToDb(
  spotifyData: NowPlayingTrack,
  trackFeatures: TrackFeatures,
  artistInfo: ArtistInfo,
  albumInfo: AlbumInfo,
  duration: number,
  timestamp: Date
): void {
  console.log(
    `[${timestamp.toUTCString()}]`,
    `${duration} sec:`,
    `${spotifyData.item.name} -`,
    `${spotifyData.item.artists[0].name}`
  );
  if (process.env.TS_NODE_DEV != "true") {
    const writeApi = client.getWriteApi(org, bucket);
    writeApi.useDefaultTags({ host: config.influxDbHostName });
    const point = new Point("track")
      .intField("seconds_played", duration) // .intField("playing", playing)
      .tag("device_id", spotifyData.device.id)
      .tag("device_name", spotifyData.device.name)
      .tag("device_type", spotifyData.device.type)
      .intField("device_volume_percent", spotifyData.device.volume_percent)
      .tag("shuffle_state", spotifyData.shuffle_state.toString())
      .tag("repeat_state", spotifyData.repeat_state)
      .tag("album_type", spotifyData.item.album.album_type)
      .tag("album_id", spotifyData.item.album.id)
      .tag("album_name", spotifyData.item.album.name)
      .tag(
        "year",
        new Date(spotifyData.item.album.release_date).getFullYear().toString()
      )
      .intField("album_total_tracks", spotifyData.item.album.total_tracks)
      .tag("explicit", spotifyData.item.explicit.toString())
      .tag("track_id", spotifyData.item.id)
      .tag("track_name", spotifyData.item.name)
      .tag("artist_id", spotifyData.item.artists[0].id)
      .tag("artist_name", spotifyData.item.artists[0].name)
      .floatField("danceability", trackFeatures.danceability)
      .floatField("energy", trackFeatures.energy)
      .tag("key", trackFeatures.key.toString())
      .floatField("loudness", trackFeatures.loudness)
      .tag("mode", trackFeatures.mode.toString())
      .floatField("speechiness", trackFeatures.speechiness)
      .floatField("acousticness", trackFeatures.acousticness)
      .floatField("instrumentalness", trackFeatures.instrumentalness)
      .floatField("liveness", trackFeatures.liveness)
      .floatField("valence", trackFeatures.valence)
      .floatField("tempo", trackFeatures.tempo)
      .intField("duration_ms", trackFeatures.duration_ms)
      .tag("time_signature", trackFeatures.time_signature.toString())
      .intField("popularity", spotifyData.item.popularity)
      .intField("artist_popularity", artistInfo.popularity)
      .tag("artist_genre", artistInfo.genres[0])
      .intField("album_popularity", albumInfo.popularity)
      .intField("artist_followers", artistInfo.followers.total)
      .timestamp(timestamp);
    writeApi.writePoint(point);
    writeApi.close();
  }
}
