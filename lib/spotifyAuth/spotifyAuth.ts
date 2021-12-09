import config from "../../config.json";
import { nanoid } from "nanoid";
import axios from "axios";
import { saveToJSON } from "../storage/objectToJsonFile";

const clientId = config.client_id;
let state = "";

function createAuthUrl(): URL {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  state = nanoid();

  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append(
    "redirect_uri",
    `http://localhost:${config.redirectPort}/callback`
  );
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("scope", "user-read-playback-state");

  return authUrl;
}

async function getAccessTokenAndSave(
  callbackCode: string,
  requestedState: string
): Promise<void> {
  const params = new URLSearchParams();

  params.append("grant_type", "authorization_code");
  params.append("code", callbackCode);
  params.append(
    "redirect_uri",
    `http://localhost:${config.redirectPort}/callback`
  );

  if (requestedState == state) {
    try {
      const accessTokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              config["spotify_clientId:Secret"]
            ).toString("base64")}`,
          },
        }
      );
      await saveToJSON(accessTokenResponse.data);
      return Promise.resolve();
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error("Invalid state");
  }
}

function requestRefreshedAccessToken(refresh_token: string): Promise<string> {
  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refresh_token);

  return axios
    .post("https://accounts.spotify.com/api/token", params, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          config["spotify_clientId:Secret"]
        ).toString("base64")}`,
      },
    })
    .then((response) => response.data.access_token);
}

export { createAuthUrl, getAccessTokenAndSave, requestRefreshedAccessToken };
