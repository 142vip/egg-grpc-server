'use strict';
const path = require('path');
const grpc = require('@grpc/grpc-js');
const loadProto = require('./loadProto');
const loadGrpcController = require('./loadGrpcController');

async function creatGRPCServerInstance(config, app) {
  const loadProtoInstance = new loadProto(app);
  const protoServiceObject = await loadProtoInstance.getProtoServiceRpcObject(path.join(app.baseDir, config.protoDir), config.loaderOption);
  const loadGrpcControllerInstance = new loadGrpcController(app);
  const rpcMethodObject = await loadGrpcControllerInstance.getGrpcMethodObject(path.join(app.baseDir, config.serviceDir));
  const grpcServer = new grpc.Server();
  // 添加服务 两个对象 按照key绑定
  grpcServer.addService(protoServiceObject, handleGrpc(rpcMethodObject));
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

function handleGrpc(grpcControllerClass) {

  const grpcControllerInstance = new grpcControllerClass();
  const grpcAsyncMethodObject = {};
  for (const [ methodName, grpcControllerMethod ] of grpcControllerInstance) {
    grpcAsyncMethodObject[methodName] = async (call, callback) => {
      try {
        const { data } = call.request;
        if (data == null) {
          // 参数错误 ，按照proto规范中定义
        }
        const result = await grpcControllerMethod(call.request.data);
        return await callback(null, result);
      } catch (error) {
        return await callback(error, {
          data: call.request,
          name: methodName,
        });
      }
    };
  }
  return grpcAsyncMethodObject;
}

module.exports = { creatGRPCServerInstance };
