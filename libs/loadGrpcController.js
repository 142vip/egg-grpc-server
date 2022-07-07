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

  // app.loader.loadToApp(path.join(app.baseDir, 'app/controller'), '__grpcController',
  //   {
  //     initializer(model) {
  //     // 第一个参数为 export 的对象
  //     // 第二个参数为一个对象，只包含当前文件的路径
  //     //   console.log('model:', model, new model());
  //       return model;
  //     },
  //   }
  // );
  // console.log('_controller:', Object.keys(app.__grpcController), typeof app.__grpcController);

  // const grpcControllerObjectMap = app.__grpcController;

  // for (const key in grpcControllerObjectMap) {
  //   console.log('typeof:', new grpcControllerObjectMap[key]());
  //   grpcControllerObject = Object.assign({}, grpcControllerObject, new grpcControllerObjectMap[key]());
  // }


  async getGrpcMethodObject(serviceDir) {
    const rpcControllerList = await this.getGrpcControllerList(serviceDir);
    let rpcObject = {};
    rpcControllerList.forEach(grpcServicePath => {
      console.log('grpcServicePath:', grpcServicePath);
      const controller = require(grpcServicePath);
      rpcObject = Object.assign({}, rpcObject, new controller());
    });
    console.log('rpcObject:', rpcObject);
    return rpcObject;
  }
}


module.exports = loadGrpcController;
