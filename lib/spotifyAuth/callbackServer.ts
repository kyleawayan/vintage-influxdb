import config from "../../config.json";
import http from "http";

class CallbackServer {
  port: string;
  server: http.Server | undefined;

  constructor() {
    this.port = config.redirectPort;
  }

  startServer(callback: (response: http.IncomingMessage) => void): void {
    const requestListener: http.RequestListener = function (req, res) {
      res.writeHead(200);
      res.end("Spotify is now authorized, you may now close this window.");
      callback(req);
    };
    this.server = http.createServer(requestListener);
    this.server.listen(this.port);
  }

  stopServer(): void {
    this.server?.close();
  }
}

export { CallbackServer };
