'use strict';

/**
 * egg-client-server default config
 * @member Config#clientServer
 * @property {String} SOME_KEY - some description
 */
exports.clientServer = {
  protoDir: 'app/grpc',
  serviceDir: 'app/grpc',
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
