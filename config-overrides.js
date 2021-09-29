const rewireLess = require("react-app-rewire-less");

module.exports = function override(config, env) {
  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@primary-color": "#1DA57A", // 녹색
    },
    javascriptEnabled: true,
  })(config, env);

  return config;
};
