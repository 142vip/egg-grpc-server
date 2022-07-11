'use strict';
const grpcServer = require('./libs');
const assert = require('assert');
module.exports = async agent => {
  const config = agent.config.grpcServer;
  if (config == null) {
    agent.logger.error('[egg-grpc-server] no grpcServer options in config file! ');
    return;
  }

  // 校验参数
  assert(config.protoDir && config.serviceDir && config.host && config.port && config.loaderOptions,
    `[egg-grpc-server] protoDir:${config.protoDir}`);

  if (config.agent) {
    await new grpcServer(agent).init();
  }
};

