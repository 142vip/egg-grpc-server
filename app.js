'use strict';
const { creatGRPCServerInstance } = require('./libs');
module.exports = async app => {
  const config = app.config.grpcServer;
  if (config == null) {
    app.logger.error('[egg-grpc-server] no grpcServer options in config file!');
    return;
  }
  const grpcServer = await creatGRPCServerInstance(config, app);
  // 开启
  grpcServer.start();
  console.log('end:', grpcServer);
};

