'use strict';
const path = require('path');
const grpc = require('@grpc/grpc-js');
const loadProto = require('./core/loadProto');
const loadGrpcController = require('./core/loadGrpcController');
const grpcServerInstance = new grpc.Server();

/**
 * grpc server 服务端类
 */
class grpcServer {
  constructor(app) {
    this.app = app;
    this.logger = app.coreLogger;
  }

  /**
     * 初始化
     */
  async init() {
    const now = new Date().getTime();
    // this.app.config.logger.disableConsoleAfterReady = false;  // 项目准备ready时候，关闭日志
    const grpcServer = await this.creatGRPCServerInstance();
    // 开启
    grpcServer.start();
    if (grpcServer.started === true) {
      this.logger.info(`[egg-grpc-server] grpc server started at http://${grpcServer.address} (${new Date().getTime() - now}ms)`);
    } else {
      this.logger.info(`[egg-grpc-server] grpc server start failed , Please check carefully! (${new Date().getTime() - now}ms)`);
    }
    return grpcServer;
  }

  /**
     * 创建grpc Server 实例
     */
  async creatGRPCServerInstance() {
    const { app } = this;
    const config = app.config.grpcServer;
    const loadProtoInstance = new loadProto(app);
    const protoFileDir = path.join(app.baseDir, config.protoDir);
    const protoServiceObject = await loadProtoInstance.getProtoServiceRpcObject(protoFileDir, config.loaderOptions);
    const loadGrpcControllerInstance = new loadGrpcController(app);
    const grpcControllerFileDir = path.join(app.baseDir, config.serviceDir);
    const grpcObject = await loadGrpcControllerInstance.handleGrpcMethod(grpcControllerFileDir);
    // 添加服务 两个对象 按照key绑定
    grpcServerInstance.addService(protoServiceObject, grpcObject);
    // promise封装，返回promise对象，async/await 调用
    return new Promise((resolve, reject) => {
      grpcServerInstance.bindAsync(`${config.host}:${config.port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
          // 绑定报错
          reject(err);
        }
        // 新增端口
        grpcServerInstance.port = port;
        grpcServerInstance.address = `${config.host}:${port}`;
        resolve(grpcServerInstance);
      });
    });
  }
}


module.exports = grpcServer;
