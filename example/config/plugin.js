'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  grpcServer: {
    enable: true,
    package: '@142vip/egg-grpc-server',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};
