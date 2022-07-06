'use strict';

/**
 * egg-grpc-server default config
 * @member Config#grpcServer
 * @property {String} SOME_KEY - some description
 */
exports.grpcServer = {
  protoDir: 'app/grpc',
  serviceDir: 'app/grpc',
  protoPath: '',
  servicePath: '',
  host: '0.0.0.0',
  port: '50051',
  loaderOption: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
};
