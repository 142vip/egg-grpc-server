'use strict';
const fse = require('fs-extra');
const fs = require('fs');

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

  const fileNameList = fs.readdirSync(protoDir);
  // 过滤
  const fileProtoNameList = fileNameList.filter(name => name.endsWith('.proto'));
  return fileProtoNameList;
}


async function getGrpcServiceList(serviceDir) {
  const ensure = await ensureDir(serviceDir);
  if (!ensure) {
    // 非目录
    console.log('-----不是目录----');
  }
  const fileNameList = fs.readdirSync(serviceDir);
  // 过滤
  const fileServiceNameList = fileNameList.filter(name => name.endsWith('.js'));
  return fileServiceNameList;
}
