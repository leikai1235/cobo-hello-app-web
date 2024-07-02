const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const hostname = "127.0.0.1";
const port = 5000;
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
    const expressApp = express();
    expressApp.use(
      "/web",
      createProxyMiddleware({
        target: "https://api.sandbox.cobo.com",
        changeOrigin: true,
        secure: false,
        logger: console,
        pathRewrite: {
          "^/v2": "/web/v2",
        },
      }),
    );

    expressApp.all("*", (req, res) => {
      handle(req, res);
    });

    expressApp.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.log("An error occurred, unable to start the app");
    console.log(err);
  });
