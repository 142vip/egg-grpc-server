'use strict';

class GrpcBaseController {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

  /**
     * grpc健康检查
     * @param request
     * @return {Promise<void>}
     */
  async healthCheck(request) {
    return request;
  }
}

module.exports = GrpcBaseController;
