# vintage-influxdb

Record your Spotify listening data on [InfluxDB](https://www.influxdata.com/).

![](https://cdn.discordapp.com/attachments/820803676502753281/843664678466093096/unknown.png)

## What's collected

Aside from how long you've been playing each song, the following are also recorded:

- Track ID
- Track Popularity
- Duration of song
- Audio Features
  - Danceability
  - Energy
  - Key
  - Loudness
  - Mode
  - Speechiness
  - Acousticness
  - Instrumentalness
  - Liveness
  - Valence
  - Tempo
  - Time Signature
- Artist ID
- Artist Genre
- Artist Popularity (Percentage)
- Artist Follower Count
- Album ID
- Album Total Tracks
- Album Type
- Device you're listening on
  - Device Name
  - Device ID
  - Device Type
  - Device Volume Percent (on Spotify app)
- Shuffle State
- Repeat State
- If track is explicit or not

## Usage

Node.js, Yarn, and an InfluxDB database is needed. You will also need `localhost` web access to `vintage-influxdb` for OAuth authentication. There is still a way to deploy `vintage-influxdb` to a server, however you will need to clone this on your local computer first.

### Spotify Setup

1. Create a Spotify application on the [Devloper Dashboard page](https://developer.spotify.com/dashboard/).
2. Once you have created your application, go to the info page for your application where the graphs are, then click on "Edit Settings".
3. Add the redirect URI: `http://localhost:4629/callback`. You may optionally change the port. Save the settings. You will need to refer to this page again for the client ID and secret.

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

5. Click the link that was console logged. If you see `Starting to record data...`, you're done!

### Deploying on a server

If you would like to host this in the cloud, you will need to move your `config.json` and `spotifyKeys.json` files from your local machine to the server. Just `git clone` this repo on your server and copy those two files over. You can also use `pm2` to run it in the background and start on boot:

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
