'use strict';

/**
 * grpc方法基础类，在模块中导出
 */
class GrpcBaseController {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  /**
   * grpc健康检查
   * @param request
   */
  async healthCheck(request) {
    return request;
  }
}

module.exports = GrpcBaseController;
