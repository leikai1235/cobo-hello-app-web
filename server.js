const express = require("express");
const next = require("next");
const createProxyMiddleware =
  require("http-proxy-middleware").createProxyMiddleware;

const hostname = "127.0.0.0";
const port = 3000;
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
const app = next({
  dev,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const app = express();
    app.use(
      "/web",
      createProxyMiddleware({
        target: "https://api.sandbox.cobo.com",
        changeOrigin: true,
        secure: false,
        logger: console,
      })
    );

    app.all("*", (req, res) => {
      handle(req, res);
    });

    app.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the app");
    console.log(err);
  });
