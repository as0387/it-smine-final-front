const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/talk/*",
    proxy({
      target: "https://itsmine.ngrok.io",

      changeOrigin: true,
    })
  );
};
