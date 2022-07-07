'use strict';
const path = require('path');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
const { getProtoFileList, getProtoServiceRpcObject } = require('./libs/load_proto');
const { getGrpcControllerList, getGrpcMethodObject } = require('./libs/load_grpc_controller');
const protoPath = 'app/grpc/test.proto';
// const controllerPath = 'app/controller';

async function creatGRPCServerInstance(config, app) {
  // const { host, port } = app.config.grpcServer;
  // 创建grpc
  // const grpcServer = new grpc.Server();
  console.log('baseDir', app, app.baseDir);
  // 获取proto文件路径
  const protoTargetPath = path.join(app.baseDir, protoPath);
  console.log('protoPath:', protoTargetPath);

  const result = await getProtoFileList(path.join(app.baseDir, 'app/grpc'));
  console.log(result);
  await getProtoServiceRpcObject(result, {});

  const test = await getGrpcControllerList(path.join(app.baseDir, 'app/grpc'));

  app.loader.loadToApp(path.join(app.baseDir, 'app/controller'), '__grpcController',
    {
      initializer(model) {
      // 第一个参数为 export 的对象
      // 第二个参数为一个对象，只包含当前文件的路径
        console.log('model:', model, new model());
        // return new model();
        return model;
      },
    }
  );
  console.log('_controller:', Object.keys(app.__grpcController), typeof app.__grpcController);

  const grpcControllerObjectMap = app.__grpcController;

  let grpcControllerObject = {};
  for (const key in grpcControllerObjectMap) {
    console.log('typeof:', new grpcControllerObjectMap[key]());
    grpcControllerObject = Object.assign({}, grpcControllerObject, new grpcControllerObjectMap[key]());
  }
  console.log('grpcControllerObject:', grpcControllerObject);

  await getGrpcMethodObject(test);

  // const packageDefinition = protoLoader.loadSync(protoTargetPath, {
  //   keepCase: true,
  //   longs: String,
  //   enums: String,
  //   defaults: true,
  //   oneofs: true,
  // });
  // console.log('packageDefinition:', packageDefinition);
  // // 获取对象
  // const grpcObject = grpc.loadPackageDefinition(packageDefinition);
  // console.log('grpcObject:', grpcObject, Object.keys(grpcObject));
  // const packageObject = grpc.loadPackageDefinition(packageDefinition).test;
  // console.log('packageObject:', packageObject, Object.keys(packageObject), Object.entries(packageObject));
  //
  // // 添加服务
  // try {
  //   console.log(port, host);
  //   // 绑定
  //   console.log(packageObject.test.service);
  //   grpcServer.addService(packageObject.test.service, {
  //     SayHello: (call, callback) => {
  //       console.log(call, callback);
  //     },
  //   });
  //   grpcServer.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  //     console.log('err:', err);
  //     console.log('port:', port);
  //     // 启动
  //     grpcServer.start();
  //     console.log('grpcServer:', grpcServer);
  //   });
  //   app.logger.info(`[grpcServer]grpc bind on port:${port}`);
  //
  //   if (grpcServer.started) {
  //     app.logger.info(`[grpcServer]grpc started on  http://${host}:${port}`);
  //   }
  // } catch (error) {
  //   app.logger.error(`[grpcServer]grpc start failed with ${error}`);
  // }
  //
  // // 返回grpcServer
  // return grpcServer;

}


module.exports = async app => {

  // const config = app.config.grpcServer;
  // if (config == null) {
  //   app.coreLogger.error('no grpcServer options in config file!');
  //   return;
  // }
  // const { protoDir, serviceDir } = config;
  // if (protoDir == null) {
  //   return;
  // }
  //
  // if (serviceDir == null) {
  //   return;
  // }

  // 单例
  // app.addSingleton('grpcServer', creatGRPCServerInstance);
  await creatGRPCServerInstance(app.config, app);
};

