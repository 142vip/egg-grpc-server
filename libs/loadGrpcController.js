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

  async getGrpcMethodObject(serviceDir) {
    const rpcControllerList = await this.getGrpcControllerList(serviceDir);
    let rpcObject = {};
    rpcControllerList.forEach(grpcServicePath => {
      const controller = require(grpcServicePath);
      rpcObject = Object.assign({}, rpcObject, new controller());
    });
    return rpcObject;
  }
}


module.exports = loadGrpcController;
