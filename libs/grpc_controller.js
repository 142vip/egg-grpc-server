'use strict';

class GrpcController {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

}

module.exports = GrpcController;
