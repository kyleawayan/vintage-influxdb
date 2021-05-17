import axios from "axios";
import fs from "fs";
import path from "path";
import writeToDb from "../influxDb/writeToDb";
import { requestRefreshedAccessToken } from "../spotifyAuth/spotifyAuth";
import { Measurer } from "../utils/measureDuration";

const projectPath = path.join(__dirname, "..", "..", "..", "spotifyKeys.json");

let currentAccessToken = "";
let currentRefreshToken = "";
let running = false;

function getCurrentlyPlaying() {
  return axios.get("https://api.spotify.com/v1/me/player", {
    headers: {
      Authorization: `Bearer ${currentAccessToken}`,
    },
  });
}

function getAudioFeatures(id: string) {
  return axios
    .get(`https://api.spotify.com/v1/audio-features/${id}`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    })
    .then((response) => response.data as TrackFeatures);
}

function getArtistInfo(id: string) {
  return axios
    .get(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    })
    .then((response) => response.data as ArtistInfo);
}

function getAlbumInfo(id: string) {
  return axios
    .get(`https://api.spotify.com/v1/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    })
    .then((response) => response.data as AlbumInfo);
}

const durationMeasurer = new Measurer();

async function recordData(): Promise<void> {
  console.log("Starting to record data...");
  let appRunning = false;

  while (running) {
    try {
      const response = await getCurrentlyPlaying();
      const timestamp = new Date();
      const spotifyData = response.data as NowPlayingTrack;

      if (response.status != 204 && spotifyData?.item.id) {
        appRunning = true;

        const trackFeatures = await getAudioFeatures(spotifyData.item.id);
        const artistInfo = await getArtistInfo(spotifyData.item.artists[0].id);
        const albumInfo = await getAlbumInfo(spotifyData.item.album.id);

        const result = durationMeasurer.checkTimer(
          spotifyData,
          { trackFeatures, artistInfo, albumInfo },
          timestamp
        );

        if (result) {
          // If there was a change
          writeToDb(
            result.track,
            result.additionalTrackInfo.trackFeatures,
            result.additionalTrackInfo.artistInfo,
            result.additionalTrackInfo.albumInfo,
            result.seconds,
            timestamp
          );
        }
      } else if (appRunning) {
        // Spotify app was closed
        console.log("Spotify was closed");
        const result = durationMeasurer.quitApp(timestamp);
        if (result.seconds != 2) {
          writeToDb(
            result.track,
            result.additionalTrackInfo.trackFeatures,
            result.additionalTrackInfo.artistInfo,
            result.additionalTrackInfo.albumInfo,
            result.seconds,
            timestamp
          );
        }
        appRunning = false;
      }

      //   if (result) {
      //     // If there was a change
      //     if (lastWroteSpotifyData) {
      //       // If Spotify app was just opened, don't write a 0 state when a song starts playing
      //       writeToDb(result.track, trackFeatures, 0, timestamp);
      //     }
      //     if (durationMeasurer.playing) {
      //       // Just skipped song
      //       writeToDb(spotifyData, trackFeatures, 1);
      //       lastWroteSpotifyData = spotifyData;
      //       lastWroteTrackFeatures = trackFeatures;
      //     } else {
      //       // Paused song
      //       lastWroteSpotifyData = null;
      //       lastWroteTrackFeatures = null;
      //     }
      //   } else if (
      //     durationMeasurer.playing &&
      //     lastWroteSpotifyData?.item.id != spotifyData.item.id
      //   ) {
      //     // For startup, when there's no track in lastWroteItem
      //     writeToDb(spotifyData, trackFeatures, 1);
      //     lastWroteSpotifyData = spotifyData;
      //     lastWroteTrackFeatures = trackFeatures;
      //   }
      // } else {
      //   if (lastWroteSpotifyData && lastWroteTrackFeatures) {
      //     // Spotify app was closed
      //     writeToDb(lastWroteSpotifyData, lastWroteTrackFeatures, 0, timestamp);
      //     lastWroteSpotifyData = null;
      //     lastWroteTrackFeatures = null;
      //   }
      // }
    } catch (e) {
      console.error(e);
      running = false;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // when access token is invalidated
  prepareToRecordData();
  return Promise.resolve();
}

function prepareToRecordData(): void {
  fs.readFile(projectPath, async (err, data) => {
    if (!err) {
      const parsedJSON = JSON.parse(data.toString());
      currentRefreshToken = parsedJSON.refresh_token;

      console.log("Refreshing token...");
      currentAccessToken = await requestRefreshedAccessToken(
        currentRefreshToken
      );
      running = true;
      recordData();
    } else {
      console.error(err);
    }
  });
}

export { prepareToRecordData };
