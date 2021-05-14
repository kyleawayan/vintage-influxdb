import { InfluxDB, Point } from "@influxdata/influxdb-client";
import config from "../../config.json";

const token = config.influxDbToken;
const org = config.influxDbOrg;
const bucket = config.influxDbBucket;

const client = new InfluxDB({
  url: config.influxDbUrl,
  token: token,
});

const writeApi = client.getWriteApi(org, bucket);
writeApi.useDefaultTags({ host: "host1" });

export default function writeToDb(
  spotifyData: NowPlayingTrack,
  trackFeatures: TrackFeatures,
  duration: number,
  timestamp: Date
): void {
  console.log(duration, spotifyData.item.name, trackFeatures.tempo, timestamp);
  const point = new Point("track")
    .intField("seconds_played", duration) // .intField("playing", playing)
    .tag("device_id", spotifyData.device.id)
    .tag("device_name", spotifyData.device.name)
    .tag("device_type", spotifyData.device.type)
    .intField("device_volume_percent", spotifyData.device.volume_percent)
    .booleanField("shuffle_state", spotifyData.shuffle_state)
    .tag("repeat_state", spotifyData.repeat_state)
    .tag("album_type", spotifyData.item.album.album_type)
    .tag("album_id", spotifyData.item.album.id)
    .tag("album_name", spotifyData.item.album.name)
    // .stringField("album_release_date", spotifyData.item.album.release_date)
    // .tag(
    //   "release_date_precision",
    //   spotifyData.item.album.release_date_precision
    // )
    .intField("album_total_tracks", spotifyData.item.album.total_tracks)
    .booleanField("explicit", spotifyData.item.explicit)
    .tag("track_id", spotifyData.item.id)
    .tag("track_name", spotifyData.item.name)
    .tag("artist_id", spotifyData.item.artists[0].id)
    .tag("artist_name", spotifyData.item.artists[0].name)
    .floatField("danceability", trackFeatures.danceability)
    .floatField("energy", trackFeatures.energy)
    .intField("key", trackFeatures.key)
    .floatField("loudness", trackFeatures.loudness)
    .intField("mode", trackFeatures.mode)
    .floatField("speechiness", trackFeatures.speechiness)
    .floatField("acousticness", trackFeatures.acousticness)
    .floatField("instrumentalness", trackFeatures.instrumentalness)
    .floatField("liveness", trackFeatures.liveness)
    .floatField("valence", trackFeatures.valence)
    .floatField("tempo", trackFeatures.tempo)
    .intField("duration_ms", trackFeatures.duration_ms)
    .intField("time_signature", trackFeatures.time_signature)
    .timestamp(timestamp);
  writeApi.writePoint(point);
}
