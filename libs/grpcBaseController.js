'use strict';

class GrpcBaseController {
  constructor(app) {
    this.app = app;
    this.ctx = app.createAnonymousContext();
  }

}

module.exports = GrpcBaseController;
