'use strict';

const fs = require('fs');
const path = require('path');

class loadGrpcController {
  constructor(app) {
    this.app = app;
    this.logger = app.coreLogger;
  }

  /**
   * 扫描文件夹中.js结尾的class类，过滤过有效的grpc controller文件路径
   *
   * @param serviceDir
   */
  async getGrpcControllerList(serviceDir) {
    const fileStat = fs.statSync(serviceDir);
    // 判断是否为目录
    if (!fileStat.isDirectory()) {
      this.logger.error(`[egg-grpc-server] isn't dir: ${serviceDir}`);
      return;
    }
    const fileNameList = fs.readdirSync(serviceDir);
    // 过滤js文件
    return fileNameList
      .filter(name => name.endsWith('.js'))
      .map(filePathName => path.join(serviceDir, filePathName));
  }

  /**
   * 循环引入grpc controller文件
   * @param serviceDir
   */
  async getGrpcControllerClassList(serviceDir) {
    const rpcControllerList = await this.getGrpcControllerList(serviceDir);
    const controllerClassList = [];
    rpcControllerList.forEach(grpcServicePath => {
      const controller = require(grpcServicePath);
      controllerClassList.push(controller);
    });
    return controllerClassList;
  }

  /**
   * 对象实例中获取对象方法的属性名称
   * @param grpcControllerInstance
   */
  // getGrpcMethodName(grpcControllerInstance) {
  //
  //   return Object.getOwnPropertyNames(grpcControllerInstance.__proto__).filter(name => name !== 'constructor');
  // }
  //

  /**
   * 处理grpc方法转换
   * @param serviceDir
   */
  async handleGrpcMethod(serviceDir) {
    const { app } = this;
    const grpcControllerClassList = await this.getGrpcControllerClassList(
      serviceDir
    );
    const grpcAsyncMethodObject = {};
    grpcControllerClassList.forEach(grpcControllerClass => {
      // 实例化对象
      const grpcControllerInstance = new grpcControllerClass(app);
      // const grpcMethodNameList = this.getGrpcMethodName(grpcControllerInstance);
      // 获取原型对象上的属性
      const grpcMethodNameList = Object.getOwnPropertyNames(
        grpcControllerClass.prototype
      ).filter(name => name !== 'constructor');
      grpcMethodNameList.forEach(methodName => {
        // 存在覆盖
        grpcAsyncMethodObject[methodName] = async (call, callback) => {
          try {
            const { data } = call.request;
            if (data == null) {
              // 参数错误 ，按照proto规范中定义
              this.logger.error(
                '[egg-grpc-server] proto file exist a init problem , please check .proto file'
              );
              return;
            }
            const now = new Date().getTime();
            // 将数据反序列化成对象传入
            const parseResultData = JSON.parse(data);
            const result = await grpcControllerInstance[methodName](
              parseResultData
            );
            this.logger.info(
              `[egg-grpc-server] use grpc method:${methodName} (${
                new Date().getTime() - now
              }ms)`
            );
            return await callback(null, {
              data: JSON.stringify(result),
            });
          } catch (error) {
            this.logger.error(
              `[egg-grpc-server] request grpc server failed , please check the error: requestMethod:${methodName}`
            );
            // callback(err,xx)
            return await callback(error);
          }
        };
      });
    });
    return grpcAsyncMethodObject;
  }
}

module.exports = loadGrpcController;
