'use strict';

const GrpcSERVER = Symbol('Context#grpcServer');

module.exports = {
  // 新增grpcServer属性，ctx.grpcServer.xxx
  get grpcServer() {
    if (!this[GrpcSERVER]) {
      this[GrpcSERVER] = this.app.grpcServer;
    }
    return this[GrpcSERVER];
  },
};
