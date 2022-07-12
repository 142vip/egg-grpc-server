'use strict';
const grpcServer = require('./libs');
module.exports = async app => {
  const config = app.config.grpcServer;
  console.log('grpc server app config:', config, config.app);
  if (config == null) {
    app.logger.error('[egg-grpc-server] no grpcServer options in config file! ');
    return;
  }
  if (config.app === true) {
    await new grpcServer(app).init();
  }
};

