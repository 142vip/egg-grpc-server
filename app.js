'use strict';
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

function creatGRPCServerInstance(config, app) {
  const { host, port, protoPath } = app.config.rpcServer;
  // 创建grpc
  const grpcServer = new grpc.Server();
  // 获取proto文件路径
  const protoTargetPath = path.join(app.baseDir, protoPath);

  const packageDefinition = protoLoader.loadSync(protoTargetPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
    // 获取对象
  const packageObject = grpc.loadPackageDefinition(packageDefinition).login;

  // 添加服务
  try {
    // 绑定
    const resultPort = grpcServer.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());
    grpcServer.addService(packageObject.login.service, rpcController(app));
    console.log(resultPort);
    if (resultPort > 0) {
      app.logger.info(`[grpcServer]grpc bind on port:${port}`);
      // 启动
      grpcServer.start();
      // console.log(grpcServer);
      if (grpcServer.started) {
        app.logger.info(`[grpcServer]grpc started on  http://${host}:${port}`);
      }
    }
  } catch (error) {
    app.logger.error(`[grpcServer]grpc start failed with ${error}`);
  }

  // 返回grpcServer
  return grpcServer;

}


module.exports = app => {
  app.addSingleton('mysql', creatGRPCServerInstance);
};

