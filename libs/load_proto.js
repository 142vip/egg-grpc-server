'use strict';
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

async function ensureDir(path) {
  try {
    await fse.ensureDir(path);
    return true;
  } catch (err) {
    console.log('-----不是目录----');
    return false;
  }
}


async function getProtoFileList(protoDir) {
  const ensure = await ensureDir(protoDir);
  if (!ensure) {
    // 非目录
    console.log('-----不是目录----');
  }
  const filePathNameList = fs.readdirSync(protoDir);
  // 过滤
  const fileProtoPathNameList = filePathNameList
    .filter(name => name.endsWith('.proto'))
    .map(filePathName => path.join(protoDir, filePathName));
  return fileProtoPathNameList;
}

async function getProtoServiceRpcObject(protoList, config) {
  const { loadOption = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  } } = config;
  const allServiceList = [];
  for (const protoTargetPath of protoList) {
    const packageDefinition = protoLoader.loadSync(protoTargetPath, loadOption);
    const grpcObject = grpc.loadPackageDefinition(packageDefinition);
    console.log('grpcObject:', grpcObject);
    for (const [ packageName, serviceObj ] of Object.entries(grpcObject)) {
      const serviceList = Object.values(serviceObj).filter(item => {
        return item.service != null;
      });
      allServiceList.push(...serviceList);
      console.log('res：', packageName, serviceList, '2233:');
    }
  }
  console.log('allServiceList:', allServiceList);

  let rpcObject = {};
  allServiceList.forEach(item => {
    rpcObject = Object.assign({}, rpcObject, item.service);
  });
  console.log('rpcObject:', rpcObject);
  return rpcObject;
}


module.exports = {
  getProtoFileList,
  getProtoServiceRpcObject,
};

