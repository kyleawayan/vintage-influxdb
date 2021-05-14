class Measurer {
  currentlyTrackingTrack: NowPlayingTrack | null;
  currentlyTrackingTrackFeatures: TrackFeatures | null;
  startDate: Date;
  playing: boolean;

  constructor() {
    this.currentlyTrackingTrack = null;
    this.currentlyTrackingTrackFeatures = null;
    this.startDate = new Date();
    this.playing = false;
  }

  checkTimer(
    currentlyTrackingTrack: NowPlayingTrack,
    currentlyTrackingTrackFeatures: TrackFeatures,
    currentTimestamp: Date
  ): MeasurerResult | null {
    if (!this.currentlyTrackingTrack || !this.playing) {
      this.startDate = new Date();
      this.currentlyTrackingTrack = currentlyTrackingTrack;
      this.currentlyTrackingTrackFeatures = currentlyTrackingTrackFeatures;
      this.playing = currentlyTrackingTrack.is_playing;
    }
    const trackedTrack = this.currentlyTrackingTrack;
    const trackedTrackFeatures = this.currentlyTrackingTrackFeatures;
    if (
      (this.currentlyTrackingTrack?.item.id != currentlyTrackingTrack.item.id &&
        this.currentlyTrackingTrack != null) ||
      (!currentlyTrackingTrack.is_playing && this.playing)
    ) {
      const duration = Math.round(
        (currentTimestamp.getTime() - this.startDate.getTime()) / 1000
      );
      this.currentlyTrackingTrack = currentlyTrackingTrack;
      this.currentlyTrackingTrackFeatures = currentlyTrackingTrackFeatures;
      this.startDate = new Date();
      this.playing = currentlyTrackingTrack.is_playing;
      return {
        seconds: duration,
        track: trackedTrack as NowPlayingTrack,
        trackFeatures: trackedTrackFeatures as TrackFeatures,
      };
    } else {
      return null;
    }
  }

  quitApp(currentTimestamp: Date): MeasurerResult {
    const tempCurrentlyPlayingTrack = this.currentlyTrackingTrack;
    const tempCurrentlyPlayingTrackFeatures =
      this.currentlyTrackingTrackFeatures;
    const duration = Math.round(
      (currentTimestamp.getTime() - this.startDate.getTime()) / 1000
    );
    this.currentlyTrackingTrack = null;
    this.currentlyTrackingTrackFeatures = null;
    return {
      seconds: duration,
      track: tempCurrentlyPlayingTrack as NowPlayingTrack,
      trackFeatures: tempCurrentlyPlayingTrackFeatures as TrackFeatures,
    };
  }
}

export { Measurer };
