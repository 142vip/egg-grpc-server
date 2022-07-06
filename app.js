'use strict';
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const protoPath = 'app/grpc/test.proto';

// class test {
//
//
//   test() {
//     return 1;
//   }
// }

function creatGRPCServerInstance(config, app) {
  console.log(222);
  const { host, port } = app.config.grpcServer;
  // 创建grpc
  const grpcServer = new grpc.Server();
  console.log('baseDir', app.baseDir);
  // 获取proto文件路径
  const protoTargetPath = path.join(app.baseDir, protoPath);
  console.log('protoPath:', protoTargetPath);

  const packageDefinition = protoLoader.loadSync(protoTargetPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  console.log('packageDefinition:', packageDefinition);
  // 获取对象
  console.log(grpc.loadPackageDefinition(packageDefinition));
  const packageObject = grpc.loadPackageDefinition(packageDefinition).test;
  console.log('packageObject:', packageObject, Object.keys(packageObject));

  // 添加服务
  try {
    console.log(port, host);
    // 绑定
    console.log(packageObject.test.service);
    grpcServer.addService(packageObject.test.service, {
      SayHello: (call, callback) => {
        console.log(call, callback);
      },
    });
    grpcServer.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
      console.log('err:', err);
      console.log('port:', port);
      // 启动
      grpcServer.start();
      console.log('grpcServer:', grpcServer);
    });
    app.logger.info(`[grpcServer]grpc bind on port:${port}`);

    if (grpcServer.started) {
      app.logger.info(`[grpcServer]grpc started on  http://${host}:${port}`);
    }
  } catch (error) {
    app.logger.error(`[grpcServer]grpc start failed with ${error}`);
  }

  // 返回grpcServer
  return grpcServer;

}


module.exports = app => {
  console.log(1111);
  // 单例
  // app.addSingleton('grpcServer', creatGRPCServerInstance);
  creatGRPCServerInstance(app.config, app);
};

