module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix the allowedHosts issue
      if (webpackConfig.devServer) {
        webpackConfig.devServer.allowedHosts = 'all';
      }
      return webpackConfig;
    },
  },
};
