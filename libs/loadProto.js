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


  async getProtoFileList(protoDir) {
    try {
      await fse.ensureDir(protoDir);
    } catch (err) {
      console.log(err);
      this.app.logger.error(`[egg-grpc-server] isn't dir: ${protoDir} `);
      return;
    }
    const filePathNameList = fs.readdirSync(protoDir);
    // 过滤
    const fileProtoPathNameList = filePathNameList
      .filter(name => name.endsWith('.proto'))
      .map(filePathName => path.join(protoDir, filePathName));
    return fileProtoPathNameList;
  }

  async getProtoServiceRpcObject(protoDir, loadOption) {
    console.log(protoDir, loadOption);
    const protoList = await this.getProtoFileList(protoDir);
    const allServiceList = [];
    for (const protoTargetPath of protoList) {
      const packageDefinition = protoLoader.loadSync(protoTargetPath, loadOption);
      const grpcObject = grpc.loadPackageDefinition(packageDefinition);
      for (const [ packageName, serviceObj ] of Object.entries(grpcObject)) {
        const serviceList = Object.values(serviceObj).filter(item => {
          return item.service != null;
        });
        allServiceList.push(...serviceList);
        console.log('getProtoServiceRpcObject：', packageName, serviceList);
      }
    }
    let rpcObject = {};
    allServiceList.forEach(item => {
      rpcObject = Object.assign({}, rpcObject, item.service);
    });
    console.log('rpcObject:', rpcObject);
    return rpcObject;
  }
}


module.exports = loadProto;
