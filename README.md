# vintage-influxdb

Record your Spotify listening data on [InfluxDB](https://www.influxdata.com/).

![](https://cdn.discordapp.com/attachments/820803676502753281/843664678466093096/unknown.png)

## What's collected

### Fields

| Data                                      | Field Name              | Type  |
| ----------------------------------------- | ----------------------- | ----- |
| Seconds played of a track (acc. by ~2sec) | `seconds_played`        | int   |
| Danceability of a track                   | `danceability`          | float |
| Energy of a track                         | `energy`                | float |
| Loudness of a track                       | `loudness`              | float |
| Speechiness of a track                    | `speechiness`           | float |
| Acousticness of a track                   | `acousticness`          | float |
| Instrumentalness of a track               | `instrumentalness`      | float |
| Liveness of a track                       | `liveness`              | float |
| Valence of a track                        | `valence`               | float |
| Device Volume Percent                     | `device_volume_percent` | int   |
| Duration of track                         | `duration_ms`           | int   |
| Track popularity (0-100)                  | `popularity`            | int   |
| Artist popularity (0-100)                 | `artist_popularity`     | int   |
| Artist followers                          | `artist_followers`      | int   |
| Album popularity (0-100)                  | `album_popularity`      | int   |
| Album Total Tracks                        | `album_total_tracks`    | int   |

### Tags

| Data                                 | Tag Name                |
| ------------------------------------ | ----------------------- |
| Track name                           | `track_name`            |
| Artist name                          | `artist_name`           |
| Album name                           | `album_name`            |
| Track ID                             | `track_id`              |
| Artist ID                            | `artist_id`             |
| Album ID                             | `album_id`              |
| Key                                  | `key`                   |
| Mode                                 | `mode`                  |
| Tempo                                | `tempo`                 |
| Time signature                       | `time_signature`        |
| Artist genre                         | `artist_genre`          |
| Album type                           | `album_type`            |
| Device name you are listening on     | `device_name`           |
| Device ID you are listening on       | `device_id`             |
| Device type you are listening on     | `device_type`           |
| Device volume percent on Spotify app | `device_volume_percent` |
| Shuffle state                        | `shuffle_state`         |
| Repeat state                         | `repeat_state`          |
| If track is explicit or not          | `explicit`              |

## Usage

Node.js, Yarn, and an InfluxDB database is needed. You will also need `localhost` web access to `vintage-influxdb` for OAuth authentication. There is still a way to deploy `vintage-influxdb` to a server, however you will need to clone this on your local machine first.

### Spotify Setup

1. Create a Spotify application on the [Devloper Dashboard page](https://developer.spotify.com/dashboard/).
2. Once you have created your application, go to the info page for your application where the graphs are, then click on "Edit Settings".
3. Add the redirect URI: `http://localhost:4629/callback`. You may optionally change the redirect port. Save the settings. You will need to refer to this page again for the client ID and secret.

### InfluxDB Setup

1. Go to your InfluxDB web UI and head over to the "Data" tab on the sidebar.
2. Go the "Buckets" tab and create a bucket.
3. Head over to the "Tokens" tab and generate a read/write token. Give the token write access to the bucket you just created.
4. Lastly go to the "Sources" tab and click on "Javascript/Node.js" under "Client Libraries". Select the appropriate token and bucket. Under "Initialize the Client" you will see the info you need for `vintage-influxdb`.

### vintage-influxdb setup

1. Clone this repository and use `yarn` to install dependencies.

```
git clone https://github.com/kyleawayan/vintage-influxdb
cd vinage-influxdb
yarn install
```

2. Edit the `config.example.json` file and fill in the values. For the `spotify_clientId:Secret` variable, it is formatted like this: `<client_id>:<client_secret>`. The variable `influxDbHostName` is just a name for the host that is sending the data (you can name it anything you want).
3. Rename the `config.example.json` file to `config.json`.
4. Start `vintage-influxdb`.

```
yarn start
```

5. Click the link that was console logged. If you see `Starting to record data...`, you're done! You can make sure it is working by playing and skipping around tracks on Spotify. It will console log some information and write data to the database about the track when it is finished playing, skipped, or paused. Make sure to watch the logs for a few minutes to make sure InfluxDB doesn't error.

There is also a [board](https://github.com/kyleawayan/vintage-influxdb/blob/main/influxdb-boards/overview.json) for InfluxDB I have made in the `influxdb-boards` folder.

### Deploying on a server

If you would like to host this on a server, you will need to move your `config.json` and `spotifyKeys.json` files from your local machine to the server. Just `git clone` this repo on your server and copy those two files over. You can also use `pm2` to run it in the background and start on boot:

```
cd vintage-influxdb
pm2 start yarn --name vintage-influxdb -- start
pm2 save
pm2 startup
```

## Developing

```
yarn dev
```

This will auto-compile on file changes using `ts-node-dev`. Writing to the database will also be disabled.
