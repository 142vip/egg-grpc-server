'use strict';
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');


class loadProto {
  constructor(app) {
    this.app = app;
  }


  /**
     * 扫描文件件中的.proto文件，过滤出proto文件
     * @param protoDir
     */
  async getProtoFileList(protoDir) {
    const { app } = this;
    try {
      await fse.ensureDir(protoDir);
    } catch (err) {
      app.logger.error(`[egg-grpc-server] isn't dir: ${protoDir} `);
      return;
    }
    const filePathNameList = fs.readdirSync(protoDir);
    // 过滤
    return filePathNameList
      .filter(name => name.endsWith('.proto'))
      .map(filePathName => path.join(protoDir, filePathName));
  }

  /**
     * 获取proto文件中service部分rpc的Object对象
     * @param protoDir
     * @param loadOption
     */
  async getProtoServiceRpcObject(protoDir, loadOption) {
    const protoList = await this.getProtoFileList(protoDir);
    const allServiceList = [];
    for (const protoTargetPath of protoList) {
      const packageDefinition = protoLoader.loadSync(protoTargetPath, loadOption);
      const grpcObject = grpc.loadPackageDefinition(packageDefinition);
      Object.values(grpcObject).forEach(serviceObj => {
        const serviceList = Object.values(serviceObj).filter(item => {
          return item.service != null;
        });
        allServiceList.push(...serviceList);
      });
    }
    let rpcObject = {};
    allServiceList.forEach(item => {
      rpcObject = Object.assign({}, rpcObject, item.service);
    });
    return rpcObject;
  }
}

module.exports = loadProto;
