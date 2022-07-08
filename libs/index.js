'use strict';
const path = require('path');
const grpc = require('@grpc/grpc-js');
const loadProto = require('./loadProto');
const loadGrpcController = require('./loadGrpcController');
const grpcServer = new grpc.Server();

async function creatGRPCServerInstance(config, app) {
  const loadProtoInstance = new loadProto(app);
  const protoServiceObject = await loadProtoInstance.getProtoServiceRpcObject(path.join(app.baseDir, config.protoDir), config.loaderOption);
  const loadGrpcControllerInstance = new loadGrpcController(app);
  const grpcObject = await loadGrpcControllerInstance.handleGrpc(path.join(app.baseDir, config.serviceDir));
  // grpcObject['SayHello']=async (call,callback)=>{
  //   console.log('grpcServer请求进来：')
  //   console.log(call.request)
  //   return await callback(null.call.request.data)
  // }
  console.log('grpcObject:',grpcObject,Object.keys(grpcObject))
  // 添加服务 两个对象 按照key绑定
  grpcServer.addService(protoServiceObject, grpcObject);
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
