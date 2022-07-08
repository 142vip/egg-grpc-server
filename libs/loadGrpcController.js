'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

class loadGrpcController {
  constructor(app) {
    this.app = app;
  }
  async getGrpcControllerList(serviceDir) {
    try {
      await fse.ensureDir(serviceDir);
    } catch (err) {
      this.app.logger.error(`[egg-grpc-server] isn't dir: ${serviceDir}`);
      return;
    }
    const fileNameList = fs.readdirSync(serviceDir);
    // 过滤
    const fileControllerNameList = fileNameList.filter(name => name.endsWith('.js'))
      .map(filePathName => path.join(serviceDir, filePathName));
    return fileControllerNameList;
  }

  async getGrpcControllerClassList(serviceDir){
    const rpcControllerList = await this.getGrpcControllerList(serviceDir);
    console.log('rpcControllerList:',rpcControllerList)
    let controllerClassList=[];
    rpcControllerList.forEach(grpcServicePath => {
      const controller = require(grpcServicePath);
      controllerClassList.push(controller)
    });
    return controllerClassList;
  }


  getGrpcMethodName(grpcControllerInstance){
    return Object.getOwnPropertyNames(grpcControllerInstance.__proto__).filter(name=>name!=='constructor')
  }

  async  handleGrpc(serviceDir) {
    const {app}=this;
    const grpcControllerClassList=await this.getGrpcControllerClassList(serviceDir)
    const grpcAsyncMethodObject = {};
    grpcControllerClassList.map(grpcControllerClass=>{
      const grpcControllerInstance = new grpcControllerClass(app);
      const grpcMethodNameList= this.getGrpcMethodName(grpcControllerInstance)
      grpcMethodNameList.map(methodName=>{
        // 存在覆盖
        grpcAsyncMethodObject[methodName] = async (call, callback) => {
          try {
            console.log('grpcClient请求进来：')
            console.log(call.request)
            const { data } = call.request;
            if (data == null) {
              // 参数错误 ，按照proto规范中定义
            }
            const parseResultData=JSON.parse(data)
            const result = await grpcControllerInstance[methodName](parseResultData);
            return await callback(null, result);
          } catch (error) {
            return await callback(error, {
              data: call.request,
              name: methodName,
            });
          }
        };
      })
    })
    return grpcAsyncMethodObject;
  }

}


module.exports = loadGrpcController;
