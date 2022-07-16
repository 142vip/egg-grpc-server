'use strict';
const grpcServer = require('./libs');
const assert = require('assert');
module.exports = app => {

  app.beforeStart(async () => {
    const config = app.config.grpcServer;
    assert(config != null, '[egg-grpc-server] no grpcServer options in config file! ');

    if (config.app === true) {
      app.coreLogger.info('[egg-grpc-server] grpc server will be loaded on app.js');
      app.grpcServer = await new grpcServer(app).init();
    }
  });
};

