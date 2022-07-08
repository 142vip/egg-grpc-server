'use strict';
const { creatGRPCServerInstance } = require('./libs');
module.exports = async app => {
  const now = new Date().getTime();
  const config = app.config.grpcServer;
  if (config == null) {
    app.logger.error(`[egg-grpc-server] no grpcServer options in config file! (${new Date().getTime() - now}ms)`);
    return;
  }
  const grpcServer = await creatGRPCServerInstance(config, app);
  // 开启
  grpcServer.start();
  if (grpcServer.started) {
    app.logger.info(`[egg-grpc-server] grpc server started at http://${grpcServer.address} (${new Date().getTime() - now}ms)`);
  } else {
    app.logger.info(`[egg-grpc-server] grpc server start failed , Please check carefully! (${new Date().getTime() - now}ms)`);
  }
  console.log('grpcServer:',grpcServer)
};

