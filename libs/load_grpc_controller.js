'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');


async function ensureDir(path) {
  try {
    await fse.ensureDir(path);
    return true;
  } catch (err) {
    console.log('-----不是目录----');
    return false;
  }
}

async function getGrpcControllerList(serviceDir) {
  const ensure = await ensureDir(serviceDir);
  if (!ensure) {
    // 非目录
    console.log('-----不是目录----');
  }
  const fileNameList = fs.readdirSync(serviceDir);
  // 过滤
  const fileControllerNameList = fileNameList.filter(name => name.endsWith('.js'))
    .map(filePathName => path.join(serviceDir, filePathName));
  return fileControllerNameList;
}

async function getGrpcMethodObject(rpcControllerList) {
  console.log(rpcControllerList);
  const allServiceList = [];

  console.log('allServiceList:', allServiceList);

  let rpcObject = {};
  allServiceList.forEach(item => {
    rpcObject = Object.assign({}, rpcObject, item.service);
  });
  console.log('rpcObject:', rpcObject);
  return rpcObject;
}


module.exports = { getGrpcControllerList, getGrpcMethodObject };
