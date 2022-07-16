'use strict';
const grpcServer = require('./libs');
const assert = require('assert');
module.exports = agent => {

  // 启动之前
  agent.beforeStart(async () => {
    const config = agent.config.grpcServer;
    if (config == null) {
      agent.logger.error('[egg-grpc-server] no grpcServer options in config file! ');
      return;
    }
    assert(config.protoDir && config.serviceDir && config.host && config.port && config.loaderOptions,
      `[egg-grpc-server] please check config file . protoDir:${config.protoDir}  serviceDir:${config.serviceDir}   host:${config.host}   port:${config.port}    loaderOptions:${config.loaderOptions}`);
    if (config.agent) {
      agent.coreLogger.info('[egg-grpc-server] grpc server will be loaded on agent.js');
      agent.grpcServer = await new grpcServer(agent).init();
    }
  });


};

