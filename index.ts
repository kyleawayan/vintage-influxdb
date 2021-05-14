import fs from "fs";
import path from "path";
import { prepareToRecordData } from "./lib/spotify/recordData";

import { CallbackServer } from "./lib/spotifyAuth/callbackServer";
import {
  createAuthUrl,
  getAccessTokenAndSave,
} from "./lib/spotifyAuth/spotifyAuth";
import { urlToQueryStrings } from "./lib/utils/parseUrl";

const server = new CallbackServer();

const spotifyKeysJsonPath = path.join(__dirname, "..", "spotifyKeys.json");

if (fs.existsSync(spotifyKeysJsonPath)) {
  prepareToRecordData();
} else {
  console.log(createAuthUrl().toString());
  server.startServer(async (response) => {
    if (response.url) {
      const queryStrings = urlToQueryStrings(response.url);
      if (queryStrings["/callback?code"] && queryStrings["state"]) {
        await getAccessTokenAndSave(
          queryStrings["/callback?code"].toString(),
          queryStrings["state"].toString()
        );
        prepareToRecordData();
      } else {
        console.error("Callback URL is invalid");
      }
    }
  });
}
