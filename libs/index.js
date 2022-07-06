// 'use strict';
//
// // const { getProtoFileList } = require('./load_proto');
// // const { getGrpcControllerList } = require('./load_grpc_controller');
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// // const protoList = getProtoFileList();
// // const grpcControllerList = getGrpcControllerList();
// // const grpcServer = new grpc.Server();
//
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
