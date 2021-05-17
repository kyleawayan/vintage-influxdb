interface AdditionalTrackInfo {
  trackFeatures: TrackFeatures;
  artistInfo: ArtistInfo;
  albumInfo: AlbumInfo;
}

interface MeasurerResult {
  seconds: number;
  track: NowPlayingTrack;
  additionalTrackInfo: AdditionalTrackInfo;
}

class Measurer {
  currentlyTrackingTrack: NowPlayingTrack | null;
  currentlyTrackingAdditionalTrackInfo: AdditionalTrackInfo | null;
  startDate: Date;
  playing: boolean;

  constructor() {
    this.currentlyTrackingTrack = null;
    this.currentlyTrackingAdditionalTrackInfo = null;
    this.startDate = new Date();
    this.playing = false;
  }

  checkTimer(
    currentlyTrackingTrack: NowPlayingTrack,
    additionalTrackInfo: AdditionalTrackInfo,
    currentTimestamp: Date
  ): MeasurerResult | null {
    if (!this.currentlyTrackingTrack || !this.playing) {
      this.startDate = new Date();
      this.currentlyTrackingTrack = currentlyTrackingTrack;
      this.currentlyTrackingAdditionalTrackInfo = additionalTrackInfo;
      this.playing = currentlyTrackingTrack.is_playing;
    }
    const trackedTrack = this.currentlyTrackingTrack;
    const trackedTrackAdditionalInfo =
      this.currentlyTrackingAdditionalTrackInfo;
    if (
      (this.currentlyTrackingTrack?.item.id != currentlyTrackingTrack.item.id &&
        this.currentlyTrackingTrack != null) ||
      (!currentlyTrackingTrack.is_playing && this.playing)
    ) {
      const duration = Math.round(
        (currentTimestamp.getTime() - this.startDate.getTime()) / 1000
      );
      this.currentlyTrackingTrack = currentlyTrackingTrack;
      this.currentlyTrackingAdditionalTrackInfo = additionalTrackInfo;
      this.startDate = new Date();
      this.playing = currentlyTrackingTrack.is_playing;
      return {
        seconds: duration,
        track: trackedTrack as NowPlayingTrack,
        additionalTrackInfo: trackedTrackAdditionalInfo as AdditionalTrackInfo,
      };
    } else {
      return null;
    }
  }

  quitApp(currentTimestamp: Date): MeasurerResult {
    const tempCurrentlyPlayingTrack = this.currentlyTrackingTrack;
    const tempCurrentlyPlayingTrackAdditionalInfo =
      this.currentlyTrackingAdditionalTrackInfo;
    const duration = Math.round(
      (currentTimestamp.getTime() - this.startDate.getTime()) / 1000
    );
    this.currentlyTrackingTrack = null;
    this.currentlyTrackingAdditionalTrackInfo = null;
    return {
      seconds: duration,
      track: tempCurrentlyPlayingTrack as NowPlayingTrack,
      additionalTrackInfo:
        tempCurrentlyPlayingTrackAdditionalInfo as AdditionalTrackInfo,
    };
  }
}

export { Measurer };
