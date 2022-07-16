
'use strict';


module.exports = appInfo => {
  const config = exports = {};
  config.keys = appInfo.name + '_142vip';

  config.grpcServer = {
    protoDir: 'app/grpc', // 存放proto文件的目录，扫描.proto后缀文件
    serviceDir: 'app/grpc', // 存放服务端远程方法的目录，扫描.js后缀文件
    host: '127.0.0.1', // 服务主机ip，建议填写0.0.0.0
    port: '50051', // grpc服务端口
    loaderOptions: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
    agent: false, // 是否在agent.js中加载，默认false
    app: true,
  };
  return config;
};
