'use strict';
const grpcServer = require('./libs');
const assert = require('assert');
module.exports = app => {
  app.beforeStart(async () => {
    const config = app.config.grpcServer;
    assert(
      config != null,
      '[egg-grpc-server] no grpcServer options in config file! '
    );
    assert(
      config.protoDir &&
        config.serviceDir &&
        config.host &&
        config.port &&
        config.loaderOptions,
      `[egg-grpc-server] please check config file . protoDir:${config.protoDir}  serviceDir:${config.serviceDir}   host:${config.host}   port:${config.port}    loaderOptions:${config.loaderOptions}`
    );
    if (config.app === true) {
      app.coreLogger.info(
        '[egg-grpc-server] grpc server will be loaded on app.js'
      );
      app.grpcServer = await new grpcServer(app).init();
    }
  });
};
