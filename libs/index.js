'use strict';
const path = require('path');
const grpc = require('@grpc/grpc-js');

const loadProto = require('./loadProto');
const loadGrpcController = require('./loadGrpcController');
// const { getProtoFileList } = require('./load_proto');
// const { getGrpcControllerList } = require('./load_grpc_controller');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const protoList = getProtoFileList();
// const grpcControllerList = getGrpcControllerList();
// const grpcServer = new grpc.Server();

//
// async function getProtoServiceRpcObject(protoList, grpcControllerList, config) {
//   const { loadOption } = config;
//   const rpcObject = {};
//   for (const protoTargetPath in protoList) {
//     const packageDefinition = protoLoader.loadSync(protoTargetPath, loadOption);
//     const grpcObject = grpc.loadPackageDefinition(packageDefinition);
//     const serviceNameList = Object.entries(grpcObject);
//     for (const serviceNameListKey in serviceNameList) {
//       console.log('serviceNameListKey', serviceNameListKey);
//     }
//   }
//   return rpcObject;
// }


// async function buildService(protoService, rpcMethodObject, config) {
//
// }


async function creatGRPCServerInstance(config, app) {
  console.log('baseDir', app, app.baseDir, path.join(app.baseDir, config.protoDir));
  const protoServiceObject = await new loadProto(app).getProtoServiceRpcObject(path.join(app.baseDir, config.protoDir), config.loaderOption);
  const rpcMethodObject = await new loadGrpcController(app).getGrpcMethodObject(path.join(app.baseDir, config.serviceDir));
  const grpcServer = new grpc.Server();
  // 添加服务 两个对象 按照key绑定
  grpcServer.addService(protoServiceObject, rpcMethodObject);
  console.log('grpcServer:', grpcServer);
  return new Promise((resolve, reject) => {
    grpcServer.bindAsync(`${config.host}:${config.port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        // 绑定报错
        reject(err);
      }
      // 新增端口
      grpcServer.port = port;
      grpcServer.address = `${config.host}:${port}`;
      resolve(grpcServer);
    });
  });
}

module.exports = { creatGRPCServerInstance };
